from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/auth/me")
async def get_current_user(request: Request):
    user = getattr(request.state, "user", None)
    if user is None:
        return {"user_id": None, "email": None}
    return {
        "user_id": user.get("sub"),
        "email": user.get("email"),
    }

