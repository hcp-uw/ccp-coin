"""Tests for stock endpoints in stock_routes.py."""

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from stock_routes import router

_app = FastAPI()
_app.include_router(router)


@pytest.fixture(scope="session")
def stock_client():
    return TestClient(_app)


def mock_ticker(price):
    """Helper to create a mock yfinance Ticker with a given last_price."""
    m = MagicMock()
    m.fast_info.last_price = price
    return m


class TestGetStockPrice:
    def test_empty_ticker_returns_error(self, stock_client):
        res = stock_client.get("/stock/price?ticker=")
        assert res.status_code == 200
        data = res.json()
        assert data["price"] is None
        assert data["error"] == "ticker is required"

    def test_missing_ticker_returns_error(self, stock_client):
        res = stock_client.get("/stock/price")
        assert res.status_code == 200
        data = res.json()
        assert data["price"] is None
        assert data["error"] == "ticker is required"

    def test_invalid_format_returns_error(self, stock_client):
        res = stock_client.get("/stock/price?ticker=123INVALID!!!")
        assert res.status_code == 200
        data = res.json()
        assert data["price"] is None
        assert data["error"] == "invalid ticker format"

    def test_valid_ticker_returns_price(self, stock_client):
        with patch("stock_routes.yf.Ticker", return_value=mock_ticker(182.50)):
            res = stock_client.get("/stock/price?ticker=AAPL")
        assert res.status_code == 200
        data = res.json()
        assert data["ticker"] == "AAPL"
        assert data["price"] == 182.50
        assert data["error"] is None

    def test_ticker_is_uppercased(self, stock_client):
        with patch("stock_routes.yf.Ticker", return_value=mock_ticker(182.50)):
            res = stock_client.get("/stock/price?ticker=aapl")
        assert res.json()["ticker"] == "AAPL"

    def test_price_is_rounded(self, stock_client):
        with patch("stock_routes.yf.Ticker", return_value=mock_ticker(182.123456)):
            res = stock_client.get("/stock/price?ticker=AAPL")
        assert res.json()["price"] == 182.12

    def test_no_price_data_returns_error(self, stock_client):
        with patch("stock_routes.yf.Ticker", return_value=mock_ticker(None)):
            res = stock_client.get("/stock/price?ticker=AAPL")
        data = res.json()
        assert data["price"] is None
        assert data["error"] == "no price data found"

    def test_yfinance_exception_returns_error(self, stock_client):
        with patch("stock_routes.yf.Ticker", side_effect=Exception("network error")):
            res = stock_client.get("/stock/price?ticker=AAPL")
        assert res.status_code == 200
        data = res.json()
        assert data["price"] is None
        assert data["error"] == "failed to fetch price"

    def test_unknown_ticker_structure(self, stock_client):
        with patch("stock_routes.yf.Ticker", return_value=mock_ticker(None)):
            res = stock_client.get("/stock/price?ticker=ZZZZ")
        data = res.json()
        assert data["ticker"] == "ZZZZ"
        assert data["price"] is None
