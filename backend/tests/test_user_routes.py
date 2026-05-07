"""Tests for user endpoints in user_routes.py."""

import time
import pytest
import jwt
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import patch
from user_routes import router

_app = FastAPI()
_app.include_router(router)

TEST_SECRET = "test-secret"


def make_token(payload: dict) -> str:
    """Create a signed JWT using the test secret."""
    return jwt.encode(payload, TEST_SECRET, algorithm="HS256")


@pytest.fixture(scope="session")
def user_client():
    return TestClient(_app)


class TestGetCurrentUser:
    def test_missing_header_returns_422(self, user_client):
        res = user_client.get("/me")
        assert res.status_code == 422

    def test_missing_bearer_prefix_returns_401(self, user_client):
        with patch("user_routes.os.getenv", return_value=TEST_SECRET):
            res = user_client.get("/me", headers={"Authorization": "notabearer"})
        assert res.status_code == 401
        assert "Invalid authorization header" in res.json()["detail"]

    def test_empty_token_returns_401(self, user_client):
        with patch("user_routes.os.getenv", return_value=TEST_SECRET):
            res = user_client.get("/me", headers={"Authorization": "Bearer "})
        assert res.status_code == 401
        assert "Token is missing" in res.json()["detail"]

    def test_missing_jwt_secret_returns_500(self, user_client):
        token = make_token({"sub": "123", "email": "test@example.com"})
        with patch("user_routes.os.getenv", return_value=None):
            res = user_client.get("/me", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 500
        assert "JWT secret not configured" in res.json()["detail"]

    def test_invalid_token_returns_401(self, user_client):
        with patch("user_routes.os.getenv", return_value=TEST_SECRET):
            res = user_client.get("/me", headers={"Authorization": "Bearer not.a.real.token"})
        assert res.status_code == 401
        assert "Invalid token" in res.json()["detail"]

    def test_expired_token_returns_401(self, user_client):
        token = make_token({
            "sub": "123",
            "email": "test@example.com",
            "exp": int(time.time()) - 60,
        })
        with patch("user_routes.os.getenv", return_value=TEST_SECRET):
            res = user_client.get("/me", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 401
        assert "Token expired" in res.json()["detail"]

    def test_valid_token_returns_200(self, user_client):
        token = make_token({"sub": "abc123", "email": "user@example.com", "role": "authenticated"})
        with patch("user_routes.os.getenv", return_value=TEST_SECRET):
            res = user_client.get("/me", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200

    def test_valid_token_returns_user_fields(self, user_client):
        token = make_token({"sub": "abc123", "email": "user@example.com", "role": "authenticated"})
        with patch("user_routes.os.getenv", return_value=TEST_SECRET):
            res = user_client.get("/me", headers={"Authorization": f"Bearer {token}"})
        data = res.json()
        assert data["id"] == "abc123"
        assert data["email"] == "user@example.com"
        assert data["role"] == "authenticated"
