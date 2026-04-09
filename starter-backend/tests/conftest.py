"""Shared fixtures available to all test files."""

import pytest
from datetime import datetime, timedelta, timezone
from fastapi.testclient import TestClient
from jose import jwt

from main import app, pwd_context, SECRET_KEY, ALGORITHM, _mock_users, _mock_bets


@pytest.fixture(scope="session")
def client():
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_mock_db():
    """Clear the in-memory mock DB before every test so state doesn't bleed."""
    _mock_users.clear()
    _mock_bets.clear()
    yield
    _mock_users.clear()
    _mock_bets.clear()


def make_token(username: str, expired: bool = False) -> str:
    delta = timedelta(hours=-1) if expired else timedelta(hours=24)
    return jwt.encode(
        {"sub": username, "exp": datetime.now(timezone.utc) + delta},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def auth(username: str) -> dict:
    return {"Authorization": f"Bearer {make_token(username)}"}


def mock_user(username: str = "testuser", balance: int = 1000, streak: int = 0) -> dict:
    """Returns a user dict using plain ints — matches what the mock DB stores."""
    return {
        "username": username,
        "password_hash": pwd_context.hash("password123"),
        "balance": balance,
        "streak": streak,
        "leaderboardRank": 1,
    }
