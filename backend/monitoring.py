"""
Monitoring module for CCP Coin backend.

Publishes custom metrics to AWS CloudWatch under the namespace "CCPCoin".

Metrics tracked:
  - API latency per endpoint (target < 2s for prediction endpoints)
  - API error rates (4xx and 5xx counts per endpoint)
  - User engagement: daily active users, streak activity, leaderboard hits
  - SageMaker endpoint failures and latency
  - S3 access errors and data ingestion failures
"""

import time
import logging
import os
import boto3
from datetime import datetime, timezone
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger("ccpcoin.monitoring")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

NAMESPACE = "CCPCoin"
REGION = os.getenv("AWS_REGION", "us-east-1")

# Endpoints where latency > 2s should trigger a high-latency alarm
LATENCY_SENSITIVE = {"/prediction/today"}

_cloudwatch = None


def _cw():
    """Lazy singleton for the CloudWatch client."""
    global _cloudwatch
    if _cloudwatch is None:
        _cloudwatch = boto3.client(
            "cloudwatch",
            region_name=REGION,
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        )
    return _cloudwatch


def _put(metric_name: str, value: float, unit: str, dimensions: list[dict]):
    """Send a single metric datum to CloudWatch. Swallows errors so monitoring
    never crashes the application."""
    try:
        _cw().put_metric_data(
            Namespace=NAMESPACE,
            MetricData=[{
                "MetricName": metric_name,
                "Dimensions": dimensions,
                "Timestamp": datetime.now(timezone.utc),
                "Value": value,
                "Unit": unit,
            }],
        )
    except Exception as exc:
        logger.warning("CloudWatch put_metric_data failed: %s", exc)


# ---------------------------------------------------------------------------
# Latency & Error-rate middleware
# ---------------------------------------------------------------------------

class MonitoringMiddleware(BaseHTTPMiddleware):
    """
    Wraps every request to record:
      - ResponseLatency  (Milliseconds) per endpoint
      - RequestCount     (Count)        per endpoint
      - ErrorCount       (Count)        per endpoint + status code bucket
    Also logs a WARNING when a latency-sensitive endpoint exceeds 2 seconds.
    """

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        method = request.method
        start = time.perf_counter()

        response = await call_next(request)

        elapsed_ms = (time.perf_counter() - start) * 1000
        status_code = response.status_code
        dimensions = [
            {"Name": "Endpoint", "Value": path},
            {"Name": "Method",   "Value": method},
        ]

        # Latency
        _put("ResponseLatency", elapsed_ms, "Milliseconds", dimensions)

        # Request count
        _put("RequestCount", 1, "Count", dimensions)

        # Error count (4xx / 5xx)
        if status_code >= 400:
            bucket = "4xx" if status_code < 500 else "5xx"
            _put("ErrorCount", 1, "Count", dimensions + [{"Name": "StatusBucket", "Value": bucket}])
            logger.warning("API error %s %s → %d (%.1f ms)", method, path, status_code, elapsed_ms)

        # Latency alert for prediction endpoints
        if path in LATENCY_SENSITIVE and elapsed_ms > 2000:
            logger.warning(
                "HIGH LATENCY on %s: %.1f ms (threshold 2000 ms)", path, elapsed_ms
            )
            _put("HighLatencyAlert", 1, "Count", dimensions)

        logger.info("%s %s %d %.1f ms", method, path, status_code, elapsed_ms)
        return response


# ---------------------------------------------------------------------------
# User engagement helpers (call these from route handlers)
# ---------------------------------------------------------------------------

def record_login(username: str):
    """Call after a successful login to track daily active users."""
    _put("DailyActiveUser", 1, "Count", [{"Name": "Username", "Value": username}])
    logger.info("DAU event: %s", username)


def record_signup(username: str):
    """Call after a successful signup."""
    _put("NewSignup", 1, "Count", [{"Name": "Username", "Value": username}])
    logger.info("New signup: %s", username)


def record_bet_placed(username: str, coins: int, streak: int):
    """Call after a successful bet to track engagement and streak activity."""
    dims = [{"Name": "Username", "Value": username}]
    _put("BetPlaced",   1,      "Count",   dims)
    _put("CoinsWagered", coins, "Count",   dims)
    _put("UserStreak",  streak, "Count",   dims)
    logger.info("Bet placed: user=%s coins=%d streak=%d", username, coins, streak)


def record_leaderboard_hit(username: str):
    """Call when a user fetches account/leaderboard info."""
    _put("LeaderboardHit", 1, "Count", [{"Name": "Username", "Value": username}])


# ---------------------------------------------------------------------------
# SageMaker monitoring helpers
# ---------------------------------------------------------------------------

def record_sagemaker_latency(endpoint_name: str, latency_ms: float, success: bool):
    """
    Call this when invoking a SageMaker endpoint.

    Example usage in main.py:
        start = time.perf_counter()
        result = sagemaker_runtime.invoke_endpoint(...)
        elapsed = (time.perf_counter() - start) * 1000
        record_sagemaker_latency("my-endpoint", elapsed, success=True)
    """
    dims = [{"Name": "SageMakerEndpoint", "Value": endpoint_name}]
    _put("SageMakerLatency", latency_ms, "Milliseconds", dims)

    if not success:
        _put("SageMakerFailure", 1, "Count", dims)
        logger.error("SageMaker endpoint FAILED: %s (%.1f ms)", endpoint_name, latency_ms)
    elif latency_ms > 2000:
        logger.warning(
            "SageMaker HIGH LATENCY: %s %.1f ms (threshold 2000 ms)", endpoint_name, latency_ms
        )
        _put("SageMakerHighLatency", 1, "Count", dims)
    else:
        logger.info("SageMaker OK: %s %.1f ms", endpoint_name, latency_ms)


def record_sagemaker_scaling_event(endpoint_name: str, event: str):
    """
    Log a SageMaker scaling event (e.g. "ScaleOut", "ScaleIn", "CoolDown").

    Example usage:
        record_sagemaker_scaling_event("my-endpoint", "ScaleOut")
    """
    _put("SageMakerScalingEvent", 1, "Count", [
        {"Name": "SageMakerEndpoint", "Value": endpoint_name},
        {"Name": "Event",             "Value": event},
    ])
    logger.info("SageMaker scaling event: %s → %s", endpoint_name, event)


# ---------------------------------------------------------------------------
# S3 monitoring helpers
# ---------------------------------------------------------------------------

def record_s3_operation(bucket: str, operation: str, success: bool, size_bytes: int = 0):
    """
    Call this around any S3 read/write operation.

    Example usage in main.py:
        try:
            s3.get_object(Bucket="my-bucket", Key="predictions/today.json")
            record_s3_operation("my-bucket", "GetObject", success=True)
        except Exception as e:
            record_s3_operation("my-bucket", "GetObject", success=False)
            raise
    """
    dims = [
        {"Name": "S3Bucket",    "Value": bucket},
        {"Name": "S3Operation", "Value": operation},
    ]
    _put("S3OperationCount", 1, "Count", dims)

    if not success:
        _put("S3AccessError", 1, "Count", dims)
        logger.error("S3 operation FAILED: %s on bucket=%s", operation, bucket)
    else:
        if size_bytes > 0:
            _put("S3BytesTransferred", size_bytes, "Bytes", dims)
        logger.info("S3 OK: %s bucket=%s bytes=%d", operation, bucket, size_bytes)


def record_s3_ingestion_failure(bucket: str, key: str, reason: str):
    """
    Call this when a data ingestion pipeline fails to read/write an S3 object.

    Example usage:
        record_s3_ingestion_failure("data-bucket", "raw/prices.csv", "NoSuchKey")
    """
    _put("S3IngestionFailure", 1, "Count", [
        {"Name": "S3Bucket", "Value": bucket},
        {"Name": "S3Key",    "Value": key},
    ])
    logger.error("S3 ingestion failure: bucket=%s key=%s reason=%s", bucket, key, reason)
