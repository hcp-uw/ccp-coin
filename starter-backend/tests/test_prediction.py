"""Tests for /prediction/today."""

from tests.conftest import auth


class TestPrediction:
    def test_prediction_returns_data(self, client):
        res = client.get("/prediction/today", headers=auth("alice"))
        assert res.status_code == 200
        data = res.json()
        assert "stock" in data
        assert "prediction" in data
        assert "confidence" in data

    def test_prediction_no_token(self, client):
        res = client.get("/prediction/today")
        assert res.status_code == 401

    def test_prediction_confidence_range(self, client):
        res = client.get("/prediction/today", headers=auth("alice"))
        confidence = res.json()["confidence"]
        assert 0.0 <= confidence <= 1.0

    def test_prediction_direction_valid(self, client):
        res = client.get("/prediction/today", headers=auth("alice"))
        assert res.json()["prediction"] in ("up", "down")

    def test_prediction_custom_stock(self, client):
        res = client.get("/prediction/today?stock=TSLA", headers=auth("alice"))
        assert res.status_code == 200
        assert res.json()["stock"] == "TSLA"

    def test_prediction_default_stock(self, client):
        res = client.get("/prediction/today", headers=auth("alice"))
        assert res.json()["stock"] == "AAPL"

    def test_prediction_count_returns_list(self, client):
        res = client.get("/prediction/today?count=3", headers=auth("alice"))
        assert res.status_code == 200
        data = res.json()
        assert isinstance(data, list)
        assert len(data) == 3

    def test_prediction_count_one_returns_object(self, client):
        res = client.get("/prediction/today?count=1", headers=auth("alice"))
        assert res.status_code == 200
        assert isinstance(res.json(), dict)
