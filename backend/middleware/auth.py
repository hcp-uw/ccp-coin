from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import os
import jwt


JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
ALGORITHM = "HS256"

PUBLIC_PATHS = {"/", "/docs", "/openapi.json", "/favicon.ico"}


class AuthMiddleware(BaseHTTPMiddleware):
    """Checks every request for a valid Supabase JWT."""

    async def dispatch(self, request: Request, call_next):
        if request.url.path in PUBLIC_PATHS:
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"detail": "Missing or invalid authorization header"},
            )

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(
                token, JWT_SECRET, algorithms=[ALGORITHM], options={"verify_aud": False}
            )
        except jwt.PyJWTError:
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid or expired token"},
            )

        request.state.user = payload
        return await call_next(request)
