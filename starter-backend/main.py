from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from boto3.dynamodb.conditions import Key, ConditionExpressionBuilder
from datetime import datetime, timedelta, timezone
import boto3
import os
from dotenv import load_dotenv
from monitoring import (
    MonitoringMiddleware,
    record_login,
    record_signup,
    record_bet_placed,
    record_leaderboard_hit,
)

load_dotenv()

app = FastAPI()
app.add_middleware(MonitoringMiddleware)


SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------------------------------------------------------------------------
# Mock DB — replace with real DynamoDB once AWS credentials are set up
# ---------------------------------------------------------------------------
USE_MOCK_DB = os.getenv("USE_MOCK_DB", "true").lower() == "true"

_mock_users = {}
_mock_bets = []


class MockTable:
    def __init__(self, store):
        self._store = store

    def get_item(self, Key):
        key_val = list(Key.values())[0]
        item = self._store.get(key_val)
        return {"Item": dict(item)} if item else {}

    def put_item(self, Item):
        key_val = Item.get("username")
        self._store[key_val] = Item

    def update_item(self, Key, UpdateExpression=None, ExpressionAttributeValues=None):
        key_val = list(Key.values())[0]
        item = self._store.get(key_val, {})
        item["balance"] = item.get("balance", 0) - ExpressionAttributeValues.get(":c", 0)
        item["streak"] = item.get("streak", 0) + ExpressionAttributeValues.get(":one", 0)
        self._store[key_val] = item

    def query(self, KeyConditionExpression):
        username = list(ConditionExpressionBuilder().build_expression(KeyConditionExpression).attribute_value_placeholders.values())[0]
        return {"Items": [b for b in self._store if b.get("username") == username]}


class MockBetsTable:
    def __init__(self):
        self._store = _mock_bets

    def put_item(self, Item):
        self._store.append(Item)

    def query(self, KeyConditionExpression):
        username = list(ConditionExpressionBuilder().build_expression(KeyConditionExpression).attribute_value_placeholders.values())[0]
        return {"Items": [b for b in self._store if b.get("username") == username]}


if USE_MOCK_DB:
    users_table = MockTable(_mock_users)
    bets_table = MockBetsTable()
else:
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
    email: str
    expected_grad_year: int

class LoginRequest(BaseModel):
    username: str
    password: str

class PlaceBetRequest(BaseModel):
    stock: str
    direction: str
    coins: int
    duration: str = "1d"
    target_price: float = None

class LoginResponse(BaseModel):
    username: str
    email: str | None
    expected_grad_year: int | None
    balance: int
    streak: int

class AccountInfoResponse(BaseModel):
    username: str
    balance: int
    dubcoins: int
    streak: int
    stocks: list[str]
    leaderboardRank: int


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
    record_login(item["username"])
    return {"token": token}


@app.get("/user/login")
async def get_login(
    username: str = Depends(verify_token),
    email: str | None = None,
    expected_grad_year: int | None = None,
):
    item = users_table.get_item(Key={"username": username}).get("Item")
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {
        "username": item["username"],
        "balance": int(item["balance"]),
        "streak": int(item["streak"]),
    }


@app.get("/user/history")
async def get_history(
    username: str = Depends(verify_token),
    limit: int = 10,
    offset: int = 0,
    result: str = None,
    stock: str = None,
):
    items = bets_table.query(KeyConditionExpression=Key("username").eq(username)).get("Items", [])
    if result:
        items = [b for b in items if b.get("result") == result]
    if stock:
        items = [b for b in items if b.get("stock") == stock]
    return items[offset: offset + limit]


@app.get("/prediction/today")
async def get_prediction(
    _: str = Depends(verify_token),
    stock: str = "AAPL",
    count: int = 1,
):
    # TODO: replace with real AI prediction call
    prediction = {"stock": stock, "prediction": "up", "confidence": 0.72}
    if count > 1:
        return [{"stock": stock, "prediction": "up", "confidence": 0.72}] * count
    return prediction


@app.get("/user/accountInfo")
async def get_account(
    username: str = Depends(verify_token),
    streak: int | None = None,
    stocks: str | None = None,
    dubcoins: int | None = None,
):
    item = users_table.get_item(Key={"username": username}).get("Item")
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    record_leaderboard_hit(username)
    return {
        "username": item["username"],
        "balance": int(item["balance"]),
        "dubcoins": int(item.get("dubcoins", 0)),
        "streak": int(item["streak"]),
        "leaderboardRank": int(item.get("leaderboardRank", 0)),
    }


@app.post("/user/signup")
async def create_account(body: SignupRequest):
    existing = users_table.get_item(Key={"username": body.username}).get("Item")
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
    users_table.put_item(Item={
        "username": body.username,
        "password_hash": pwd_context.hash(body.password),
        "email": body.email,
        "expected_grad_year": body.expected_grad_year,
        "balance": 1000,
        "dubcoins": 0,
        "streak": 0,
        "leaderboardRank": 0,
    })
    record_signup(body.username)
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
        "duration": body.duration,
        "target_price": body.target_price,
    })

    new_balance = int(item["balance"]) - body.coins
    new_streak = int(item["streak"]) + 1
    record_bet_placed(username, body.coins, new_streak)
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
