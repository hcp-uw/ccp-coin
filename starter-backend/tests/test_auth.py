"""Tests for /auth/login and /auth/logout."""

from jose import jwt
from main import SECRET_KEY, ALGORITHM, _mock_users
from tests.conftest import auth, mock_user, make_token


class TestLogin:
    def test_login_success(self, client):
        _mock_users["alice"] = mock_user("alice")
        res = client.post("/auth/login", json={"username": "alice", "password": "password123"})
        assert res.status_code == 200
        assert "token" in res.json()

    def test_login_wrong_password(self, client):
        _mock_users["alice"] = mock_user("alice")
        res = client.post("/auth/login", json={"username": "alice", "password": "wrongpass"})
        assert res.status_code == 401
        assert res.json()["detail"] == "Invalid credentials"

    def test_login_user_not_found(self, client):
        res = client.post("/auth/login", json={"username": "ghost", "password": "pass"})
        assert res.status_code == 401

    def test_login_missing_fields(self, client):
        res = client.post("/auth/login", json={"username": "alice"})
        assert res.status_code == 422

    def test_login_token_contains_username(self, client):
        _mock_users["alice"] = mock_user("alice")
        res = client.post("/auth/login", json={"username": "alice", "password": "password123"})
        token = res.json()["token"]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert payload["sub"] == "alice"


class TestLogout:
    def test_logout_success(self, client):
        res = client.post("/auth/logout", headers=auth("alice"))
        assert res.status_code == 200
        assert res.json()["success"] is True

    def test_logout_no_token(self, client):
        res = client.post("/auth/logout")
        assert res.status_code == 401
