"""Integration tests verifying mock DB read/write correctness."""

from main import pwd_context, _mock_users, _mock_bets
from tests.conftest import auth, mock_user


class TestDynamoDBIntegration:
    def test_signup_stores_correct_fields(self, client):
        client.post("/user/signup", json={"username": "bob", "password": "secret", "email": "bob@example.com", "expected_grad_year": 2027})
        item = _mock_users.get("bob")
        assert item is not None
        assert item["username"] == "bob"
        assert "password_hash" in item
        assert item["balance"] == 1000
        assert item["streak"] == 0
        assert item["leaderboardRank"] == 0

    def test_signup_password_is_hashed(self, client):
        client.post("/user/signup", json={"username": "bob", "password": "plaintext", "email": "bob@example.com", "expected_grad_year": 2027})
        stored_hash = _mock_users["bob"]["password_hash"]
        assert stored_hash != "plaintext"
        assert pwd_context.verify("plaintext", stored_hash)

    def test_bet_updates_balance_and_streak(self, client):
        _mock_users["bob"] = mock_user("bob", balance=500, streak=2)
        client.post(
            "/user/bet",
            json={"stock": "AAPL", "direction": "up", "coins": 200},
            headers=auth("bob"),
        )
        updated = _mock_users["bob"]
        assert updated["balance"] == 300
        assert updated["streak"] == 3

    def test_bet_writes_to_bets_store(self, client):
        _mock_users["bob"] = mock_user("bob", balance=500, streak=0)
        client.post(
            "/user/bet",
            json={"stock": "TSLA", "direction": "down", "coins": 50},
            headers=auth("bob"),
        )
        assert len(_mock_bets) == 1
        assert _mock_bets[0]["stock"] == "TSLA"
        assert _mock_bets[0]["direction"] == "down"
        assert _mock_bets[0]["coins"] == 50
        assert _mock_bets[0]["result"] == "pending"
        assert _mock_bets[0]["username"] == "bob"

    def test_history_returns_only_user_bets(self, client):
        _mock_users["alice"] = mock_user("alice")
        _mock_users["bob"] = mock_user("bob")
        _mock_bets.append({"username": "alice", "stock": "AAPL", "coins": 100, "result": "pending", "direction": "up", "timestamp": "2024-01-01"})
        _mock_bets.append({"username": "bob",   "stock": "TSLA", "coins": 50,  "result": "pending", "direction": "down", "timestamp": "2024-01-01"})
        res = client.get("/user/history", headers=auth("alice"))
        assert res.status_code == 200
        items = res.json()
        assert all(b["username"] == "alice" for b in items)

    def test_get_login_reads_from_mock_store(self, client):
        _mock_users["carol"] = mock_user("carol", balance=750, streak=4)
        res = client.get("/user/login", headers=auth("carol"))
        assert res.status_code == 200
        assert res.json()["balance"] == 750
        assert res.json()["streak"] == 4

    def test_account_info_reads_leaderboard_rank(self, client):
        user = mock_user("carol")
        user["leaderboardRank"] = 5
        _mock_users["carol"] = user
        res = client.get("/user/accountInfo", headers=auth("carol"))
        assert res.json()["leaderboardRank"] == 5
