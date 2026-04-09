"""Tests for /user/bet (POST) and /user/history (GET)."""

from unittest.mock import patch
from main import _mock_users, _mock_bets
from tests.conftest import auth, mock_user


class TestPlaceBet:
    def test_place_bet_success(self, client):
        _mock_users["alice"] = mock_user("alice", balance=1000)
        res = client.post(
            "/user/bet",
            json={"stock": "AAPL", "direction": "up", "coins": 100},
            headers=auth("alice"),
        )
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert data["newBalance"] == 900
        assert data["streak"] == 1

    def test_place_bet_insufficient_balance(self, client):
        _mock_users["alice"] = mock_user("alice", balance=50)
        res = client.post(
            "/user/bet",
            json={"stock": "AAPL", "direction": "up", "coins": 100},
            headers=auth("alice"),
        )
        assert res.status_code == 400
        assert res.json()["detail"] == "Insufficient balance"

    def test_place_bet_exact_balance(self, client):
        _mock_users["alice"] = mock_user("alice", balance=100)
        res = client.post(
            "/user/bet",
            json={"stock": "AAPL", "direction": "up", "coins": 100},
            headers=auth("alice"),
        )
        assert res.status_code == 200
        assert res.json()["newBalance"] == 0

    def test_place_bet_zero_coins(self, client):
        _mock_users["alice"] = mock_user("alice", balance=1000)
        res = client.post(
            "/user/bet",
            json={"stock": "AAPL", "direction": "up", "coins": 0},
            headers=auth("alice"),
        )
        assert res.status_code == 200

    def test_place_bet_no_token(self, client):
        res = client.post("/user/bet", json={"stock": "AAPL", "direction": "up", "coins": 100})
        assert res.status_code == 401

    def test_place_bet_user_not_found(self, client):
        res = client.post(
            "/user/bet",
            json={"stock": "AAPL", "direction": "up", "coins": 100},
            headers=auth("ghost"),
        )
        assert res.status_code == 404

    def test_place_bet_missing_fields(self, client):
        _mock_users["alice"] = mock_user("alice")
        res = client.post("/user/bet", json={"stock": "AAPL"}, headers=auth("alice"))
        assert res.status_code == 422

    def test_place_bet_writes_pending_to_mock(self, client):
        _mock_users["alice"] = mock_user("alice", balance=1000)
        client.post(
            "/user/bet",
            json={"stock": "TSLA", "direction": "down", "coins": 50},
            headers=auth("alice"),
        )
        assert len(_mock_bets) == 1
        bet = _mock_bets[0]
        assert bet["stock"] == "TSLA"
        assert bet["direction"] == "down"
        assert bet["coins"] == 50
        assert bet["result"] == "pending"
        assert bet["username"] == "alice"
        assert bet["duration"] == "1d"
        assert bet["target_price"] is None

    def test_place_bet_with_duration(self, client):
        _mock_users["alice"] = mock_user("alice", balance=1000)
        res = client.post(
            "/user/bet",
            json={"stock": "AAPL", "direction": "up", "coins": 100, "duration": "1w"},
            headers=auth("alice"),
        )
        assert res.status_code == 200
        assert _mock_bets[0]["duration"] == "1w"

    def test_place_bet_with_target_price(self, client):
        _mock_users["alice"] = mock_user("alice", balance=1000)
        res = client.post(
            "/user/bet",
            json={"stock": "AAPL", "direction": "up", "coins": 100, "target_price": 195.50},
            headers=auth("alice"),
        )
        assert res.status_code == 200
        assert _mock_bets[0]["target_price"] == 195.50


class TestGetHistory:
    def test_history_returns_items(self, client):
        _mock_users["alice"] = mock_user("alice")
        _mock_bets.append({"username": "alice", "timestamp": "2024-01-01T00:00:00+00:00",
                           "stock": "AAPL", "direction": "up", "result": "win", "coins": 100})
        _mock_bets.append({"username": "alice", "timestamp": "2024-01-02T00:00:00+00:00",
                           "stock": "TSLA", "direction": "down", "result": "pending", "coins": 50})
        res = client.get("/user/history", headers=auth("alice"))
        assert res.status_code == 200
        assert len(res.json()) == 2

    def test_history_empty(self, client):
        res = client.get("/user/history", headers=auth("alice"))
        assert res.status_code == 200
        assert res.json() == []

    def test_history_no_token(self, client):
        res = client.get("/user/history")
        assert res.status_code == 401

    def test_history_returns_only_own_bets(self, client):
        _mock_bets.append({"username": "alice", "stock": "AAPL", "coins": 100, "result": "pending", "direction": "up", "timestamp": "2024-01-01"})
        _mock_bets.append({"username": "bob",   "stock": "TSLA", "coins": 50,  "result": "pending", "direction": "down", "timestamp": "2024-01-01"})
        res = client.get("/user/history", headers=auth("alice"))
        assert res.status_code == 200
        assert all(b["username"] == "alice" for b in res.json())

    def test_history_filter_by_result(self, client):
        _mock_bets.append({"username": "alice", "stock": "AAPL", "coins": 100, "result": "win", "direction": "up", "timestamp": "2024-01-01"})
        _mock_bets.append({"username": "alice", "stock": "TSLA", "coins": 50, "result": "pending", "direction": "down", "timestamp": "2024-01-02"})
        res = client.get("/user/history?result=win", headers=auth("alice"))
        assert res.status_code == 200
        assert len(res.json()) == 1
        assert res.json()[0]["result"] == "win"

    def test_history_filter_by_stock(self, client):
        _mock_bets.append({"username": "alice", "stock": "AAPL", "coins": 100, "result": "win", "direction": "up", "timestamp": "2024-01-01"})
        _mock_bets.append({"username": "alice", "stock": "TSLA", "coins": 50, "result": "pending", "direction": "down", "timestamp": "2024-01-02"})
        res = client.get("/user/history?stock=TSLA", headers=auth("alice"))
        assert res.status_code == 200
        assert len(res.json()) == 1
        assert res.json()[0]["stock"] == "TSLA"

    def test_history_limit(self, client):
        for i in range(5):
            _mock_bets.append({"username": "alice", "stock": "AAPL", "coins": 10, "result": "pending", "direction": "up", "timestamp": f"2024-01-0{i+1}"})
        res = client.get("/user/history?limit=3", headers=auth("alice"))
        assert res.status_code == 200
        assert len(res.json()) == 3

    def test_history_offset(self, client):
        for i in range(5):
            _mock_bets.append({"username": "alice", "stock": "AAPL", "coins": 10, "result": "pending", "direction": "up", "timestamp": f"2024-01-0{i+1}"})
        res = client.get("/user/history?offset=3", headers=auth("alice"))
        assert res.status_code == 200
        assert len(res.json()) == 2
