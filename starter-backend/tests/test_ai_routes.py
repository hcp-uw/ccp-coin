"""Tests for AI prediction endpoints in ai_routes.py."""

import pytest
from fastapi.testclient import TestClient
from ai_routes import app

@pytest.fixture(scope="session")
def ai_client():
    return TestClient(app)


class TestPredictionToday:
    def test_returns_200(self, ai_client):
        res = ai_client.get("/prediction/today")
        assert res.status_code == 200

    def test_default_stock(self, ai_client):
        res = ai_client.get("/prediction/today")
        assert res.json()["stock"] == "AAPL"

    def test_custom_stock(self, ai_client):
        res = ai_client.get("/prediction/today?stock=TSLA")
        assert res.json()["stock"] == "TSLA"

    def test_has_required_fields(self, ai_client):
        res = ai_client.get("/prediction/today")
        data = res.json()
        assert "stock" in data
        assert "prediction" in data
        assert "confidence" in data

    def test_direction_valid(self, ai_client):
        res = ai_client.get("/prediction/today")
        assert res.json()["prediction"] in ("up", "down")

    def test_confidence_range(self, ai_client):
        res = ai_client.get("/prediction/today")
        assert 0.0 <= res.json()["confidence"] <= 1.0



class TestPredictionHistory:
    def test_returns_200(self, ai_client):
        res = ai_client.get("/prediction/history?stock=AAPL")
        assert res.status_code == 200

    def test_returns_list(self, ai_client):
        res = ai_client.get("/prediction/history?stock=AAPL")
        assert isinstance(res.json(), list)

    def test_default_stock(self, ai_client):
        res = ai_client.get("/prediction/history")
        assert res.status_code == 200

    def test_items_have_required_fields(self, ai_client):
        res = ai_client.get("/prediction/history?stock=AAPL")
        for item in res.json():
            assert "stock" in item
            assert "prediction" in item
            assert "confidence" in item
            assert "actual" in item
            assert "correct" in item
            assert "date" in item

    def test_stock_matches_query(self, ai_client):
        res = ai_client.get("/prediction/history?stock=TSLA")
        for item in res.json():
            assert item["stock"] == "TSLA"

    def test_limit(self, ai_client):
        res = ai_client.get("/prediction/history?stock=AAPL&limit=1")
        assert len(res.json()) <= 1

    def test_correct_is_boolean(self, ai_client):
        res = ai_client.get("/prediction/history?stock=AAPL")
        for item in res.json():
            assert isinstance(item["correct"], bool)
