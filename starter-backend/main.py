from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from boto3.dynamodb.conditions import Key
from datetime import datetime, timedelta, timezone
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

##app.mount("/static", StaticFiles(directory="static"), name="static")

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

dynamodb = boto3.resource(
    "dynamodb",
    region_name=os.getenv("AWS_REGION", "us-east-1"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)
users_table = dynamodb.Table("Users")
bets_table = dynamodb.Table("Bets")


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


# Request body models
class SignupRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class PlaceBetRequest(BaseModel):
    stock: str
    direction: str
    coins: int


@app.post("/auth/login")
async def login(body: LoginRequest):
    item = users_table.get_item(Key={"username": body.username}).get("Item")
    if not item or not pwd_context.verify(body.password, item["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = jwt.encode(
        {"sub": item["username"], "exp": datetime.now(timezone.utc) + timedelta(hours=24)},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    return {"token": token}


@app.get("/user/login")
async def get_login(username: str = Depends(verify_token)):
    item = users_table.get_item(Key={"username": username}).get("Item")
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"username": item["username"], "balance": item["balance"], "streak": item["streak"]}


@app.get("/user/history")
async def get_history(username: str = Depends(verify_token)):
    response = bets_table.query(KeyConditionExpression=Key("username").eq(username))
    return response.get("Items", [])


@app.get("/prediction/today")
async def get_prediction(username: str = Depends(verify_token)):
    # TODO: replace with real AI prediction call
    return {"stock": "AAPL", "prediction": "up", "confidence": 0.72}


@app.get("/user/accountInfo")
async def get_account(username: str = Depends(verify_token)):
    item = users_table.get_item(Key={"username": username}).get("Item")
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {
        "username": item["username"],
        "balance": item["balance"],
        "streak": item["streak"],
        "leaderboardRank": item.get("leaderboardRank", 0),
    }


@app.post("/user/signup")
async def create_account(body: SignupRequest):
    existing = users_table.get_item(Key={"username": body.username}).get("Item")
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
    users_table.put_item(Item={
        "username": body.username,
        "password_hash": pwd_context.hash(body.password),
        "balance": 1000,
        "streak": 0,
        "leaderboardRank": 0,
    })
    return {"success": True, "message": "Account created"}


@app.post("/user/bet")
async def place_bet(body: PlaceBetRequest, username: str = Depends(verify_token)):
    item = users_table.get_item(Key={"username": username}).get("Item")
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if item["balance"] < body.coins:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient balance")

    users_table.update_item(
        Key={"username": username},
        UpdateExpression="SET balance = balance - :c, streak = streak + :one",
        ExpressionAttributeValues={":c": body.coins, ":one": 1},
    )
    bets_table.put_item(Item={
        "username": username,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "stock": body.stock,
        "direction": body.direction,
        "result": "pending",
        "coins": body.coins,
    })

    new_balance = item["balance"] - body.coins
    new_streak = item["streak"] + 1
    return {"success": True, "newBalance": new_balance, "streak": new_streak}


@app.post("/auth/logout")
async def log_out(username: str = Depends(verify_token)):
    # JWTs are stateless — the client should discard the token on logout.
    # For server-side invalidation, add a RevokedTokens table and check it in verify_token.
    return {"success": True, "message": "Logged out"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
