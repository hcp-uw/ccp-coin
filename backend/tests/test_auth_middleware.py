"""Tests for the AuthMiddleware and /auth/me endpoint."""

import os
import sys
import time
import uuid

import jwt
import pytest
from fastapi import FastAPI, Request
from fastapi.testclient import TestClient

TEST_JWT_SECRET = "test-secret-for-auth-middleware-tests"
os.environ["SUPABASE_JWT_SECRET"] = TEST_JWT_SECRET

# Force a fresh import of middleware.auth so it picks up the test secret
for mod in list(sys.modules):
    if mod.startswith("middleware"):
        del sys.modules[mod]

from middleware.auth import AuthMiddleware  # noqa: E402

# ── Helper: build a test app ──


def _make_app(*, protected_routes: bool = True) -> FastAPI:
    """Create a minimal FastAPI app with AuthMiddleware for testing."""
    app = FastAPI()

    @app.get("/")
    def root():
        return {"status": "ok"}

    @app.get("/docs")
    def docs():
        return {"swagger": "ui"}

    @app.get("/openapi.json")
    def openapi():
        return {"openapi": "3.0"}

    @app.get("/favicon.ico")
    def favicon():
        return {"icon": "favicon"}

    if protected_routes:

        @app.get("/auth/me")
        def me(request: Request):
            return {
                "user_id": request.state.user.get("sub"),
                "email": request.state.user.get("email"),
            }

        @app.get("/protected")
        def protected(request: Request):
            return {"user_id": request.state.user.get("sub")}

    app.add_middleware(AuthMiddleware)
    return app


# ── Fixtures ──


@pytest.fixture(scope="session")
def auth_client():
    return TestClient(_make_app(protected_routes=True), raise_server_exceptions=False)


@pytest.fixture(scope="session")
def valid_token():
    """Generate a real HS256 JWT signed with TEST_JWT_SECRET."""
    now = int(time.time())
    payload = {
        "sub": str(uuid.uuid4()),
        "email": "testuser@example.com",
        "iat": now,
        "exp": now + 3600,
    }
    return jwt.encode(payload, TEST_JWT_SECRET, algorithm="HS256")


# ═══════════════════════════════════════════════════════════════════
# Public paths (should be accessible without any token)
# ═══════════════════════════════════════════════════════════════════


class TestPublicPaths:
    def test_root_is_public(self, auth_client):
        """GET / should be accessible without auth."""
        res = auth_client.get("/")
        assert res.status_code == 200
        assert res.json()["status"] == "ok"

    def test_docs_is_public(self, auth_client):
        """GET /docs should be accessible without auth."""
        res = auth_client.get("/docs")
        assert res.status_code == 200

    def test_openapi_json_is_public(self, auth_client):
        """GET /openapi.json should be accessible without auth."""
        res = auth_client.get("/openapi.json")
        assert res.status_code == 200

    def test_favicon_ico_is_public(self, auth_client):
        """GET /favicon.ico should be accessible without auth."""
        res = auth_client.get("/favicon.ico")
        assert res.status_code == 200


# ═══════════════════════════════════════════════════════════════════
# Missing / invalid Authorization header
# ═══════════════════════════════════════════════════════════════════


class TestMissingToken:
    def test_no_auth_header_returns_401(self, auth_client):
        """Protected route without any Authorization header → 401."""
        res = auth_client.get("/protected")
        assert res.status_code == 401

    def test_no_bearer_prefix_returns_401(self, auth_client):
        """Authorization header without Bearer prefix → 401."""
        res = auth_client.get("/protected", headers={"Authorization": "Token abc"})
        assert res.status_code == 401

    def test_empty_bearer_token_returns_401(self, auth_client):
        """Authorization: Bearer <empty> → 401."""
        res = auth_client.get("/protected", headers={"Authorization": "Bearer "})
        assert res.status_code == 401

    def test_malformed_header_returns_401(self, auth_client):
        """Header value without Bearer prefix → 401."""
        res = auth_client.get("/protected", headers={"Authorization": "Basic xyz"})
        assert res.status_code == 401


# ═══════════════════════════════════════════════════════════════════
# Token validation
# ═══════════════════════════════════════════════════════════════════


class TestInvalidToken:
    def test_garbage_token_returns_401(self, auth_client):
        """Completely invalid JWT string → 401."""
        res = auth_client.get(
            "/protected",
            headers={"Authorization": "Bearer this.is.not.a.valid.jwt"},
        )
        assert res.status_code == 401

    def test_wrong_secret_returns_401(self, auth_client):
        """Token signed with a different secret → 401."""
        now = int(time.time())
        payload = {
            "sub": str(uuid.uuid4()),
            "email": "hacker@example.com",
            "iat": now,
            "exp": now + 3600,
        }
        wrong_token = jwt.encode(payload, "wrong-secret", algorithm="HS256")
        res = auth_client.get(
            "/protected",
            headers={"Authorization": f"Bearer {wrong_token}"},
        )
        assert res.status_code == 401

    def test_expired_token_returns_401(self, auth_client):
        """Token with past expiration → 401."""
        now = int(time.time())
        payload = {
            "sub": str(uuid.uuid4()),
            "email": "expired@example.com",
            "iat": now - 7200,
            "exp": now - 3600,
        }
        expired_token = jwt.encode(payload, TEST_JWT_SECRET, algorithm="HS256")
        res = auth_client.get(
            "/protected",
            headers={"Authorization": f"Bearer {expired_token}"},
        )
        assert res.status_code == 401

    def test_invalid_audience_still_passes(self, auth_client, valid_token):
        """The middleware does NOT verify audience, so wrong aud should still work."""
        now = int(time.time())
        payload = {
            "sub": str(uuid.uuid4()),
            "email": "wrongaud@example.com",
            "iat": now,
            "exp": now + 3600,
            "aud": "wrong-audience",
        }
        token = jwt.encode(payload, TEST_JWT_SECRET, algorithm="HS256")
        res = auth_client.get(
            "/protected",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert res.status_code == 200


# ═══════════════════════════════════════════════════════════════════
# Valid token → successful auth
# ═══════════════════════════════════════════════════════════════════


class TestValidToken:
    def test_valid_token_returns_200(self, auth_client, valid_token):
        """Protected route with valid token → 200."""
        res = auth_client.get("/protected", headers={"Authorization": f"Bearer {valid_token}"})
        assert res.status_code == 200

    def test_user_id_in_response(self, auth_client, valid_token):
        """The /auth/me endpoint returns the user_id from the token."""
        res = auth_client.get("/auth/me", headers={"Authorization": f"Bearer {valid_token}"})
        data = res.json()
        assert "user_id" in data
        assert data["email"] == "testuser@example.com"

    def test_sub_matches_token(self, auth_client, valid_token):
        """The sub claim is passed through as user_id."""
        decoded = jwt.decode(valid_token, TEST_JWT_SECRET, algorithms=["HS256"])
        res = auth_client.get("/auth/me", headers={"Authorization": f"Bearer {valid_token}"})
        assert res.json()["user_id"] == decoded["sub"]

    def test_email_matches_token(self, auth_client, valid_token):
        """The email claim is passed through as email."""
        decoded = jwt.decode(valid_token, TEST_JWT_SECRET, algorithms=["HS256"])
        res = auth_client.get("/auth/me", headers={"Authorization": f"Bearer {valid_token}"})
        assert res.json()["email"] == decoded["email"]
