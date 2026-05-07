import os
from fastapi import APIRouter, HTTPException, Header
import jwt

router = APIRouter()


@router.get("/me")
async def get_current_user(authorization: str = Header(...)):
    """
    Returns the current Supabase user from a Bearer JWT token.

    The frontend should pass the Supabase session token in the header:
        Authorization: Bearer <supabase_access_token>

    Requires SUPABASE_JWT_SECRET in .env
    (Supabase dashboard → Settings → API → JWT Secret).
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.removeprefix("Bearer ").strip()

    if not token:
        raise HTTPException(status_code=401, detail="Token is missing")

    secret = os.getenv("SUPABASE_JWT_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="JWT secret not configured")

    try:
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        return {
            "id": payload.get("sub"),
            "email": payload.get("email"),
            "role": payload.get("role"),
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
