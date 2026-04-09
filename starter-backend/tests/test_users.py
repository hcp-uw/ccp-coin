"""Tests for /user/signup, /user/login (GET), and /user/accountInfo."""

from main import _mock_users
from tests.conftest import auth, mock_user, make_token


class TestSignup:
    def test_signup_success(self, client):
        res = client.post("/user/signup", json={"username": "alice", "password": "pass123", "email": "alice@example.com", "expected_grad_year": 2026})
        assert res.status_code == 200
        assert res.json() == {"success": True, "message": "Account created"}

    def test_signup_duplicate_username(self, client):
        _mock_users["alice"] = mock_user("alice")
        res = client.post("/user/signup", json={"username": "alice", "password": "pass123", "email": "alice@example.com", "expected_grad_year": 2026})
        assert res.status_code == 400
        assert res.json()["detail"] == "Username already taken"

    def test_signup_missing_password(self, client):
        res = client.post("/user/signup", json={"username": "alice"})
        assert res.status_code == 422

    def test_signup_missing_username(self, client):
        res = client.post("/user/signup", json={"password": "pass123"})
        assert res.status_code == 422

    def test_signup_empty_body(self, client):
        res = client.post("/user/signup", json={})
        assert res.status_code == 422


class TestGetLogin:
    def test_get_login_success(self, client):
        _mock_users["alice"] = mock_user("alice", balance=500, streak=3)
        res = client.get("/user/login", headers=auth("alice"))
        assert res.status_code == 200
        data = res.json()
        assert data["username"] == "alice"
        assert data["balance"] == 500
        assert data["streak"] == 3

    def test_get_login_no_token(self, client):
        res = client.get("/user/login")
        assert res.status_code == 401

    def test_get_login_expired_token(self, client):
        res = client.get("/user/login", headers={"Authorization": f"Bearer {make_token('alice', expired=True)}"})
        assert res.status_code == 401

    def test_get_login_invalid_token(self, client):
        res = client.get("/user/login", headers={"Authorization": "Bearer notavalidtoken"})
        assert res.status_code == 401

    def test_get_login_user_not_in_db(self, client):
        res = client.get("/user/login", headers=auth("ghost"))
        assert res.status_code == 404


class TestAccountInfo:
    def test_account_info_success(self, client):
        _mock_users["alice"] = mock_user("alice", balance=800, streak=5)
        res = client.get("/user/accountInfo", headers=auth("alice"))
        assert res.status_code == 200
        data = res.json()
        assert data["username"] == "alice"
        assert data["balance"] == 800
        assert data["streak"] == 5
        assert "leaderboardRank" in data

    def test_account_info_default_rank(self, client):
        user = mock_user("alice")
        del user["leaderboardRank"]
        _mock_users["alice"] = user
        res = client.get("/user/accountInfo", headers=auth("alice"))
        assert res.status_code == 200
        assert res.json()["leaderboardRank"] == 0

    def test_account_info_no_token(self, client):
        res = client.get("/user/accountInfo")
        assert res.status_code == 401

    def test_account_info_user_not_found(self, client):
        res = client.get("/user/accountInfo", headers=auth("ghost"))
        assert res.status_code == 404
