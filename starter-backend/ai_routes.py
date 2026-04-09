from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionResponse(BaseModel):
    stock: str
    prediction: str
    confidence: float


class UserPredictionRequest(BaseModel):
    user_id: str
    stock: str
    prediction: str  # "up" or "down"


async def fetch_ai_prediction(stock: str) -> PredictionResponse:
    """
    Replace this with a real AI API call, e.g.:
        response = await openai_client.chat.completions.create(...)
    """
    # TODO: replace with real AI call
    return PredictionResponse(stock=stock, prediction="up", confidence=0.72)


# Returns today's AI prediction for a given stock
@app.get("/prediction/today")
async def get_prediction(stock: str = "AAPL"):
    return await fetch_ai_prediction(stock)


# Returns the AI's past prediction history for a given stock
@app.get("/prediction/history")
async def get_prediction_history(stock: str = "AAPL", limit: int = 10):
    # TODO: query Supabase ai_predictions table
    mock_history = [
        {"stock": stock, "prediction": "up", "confidence": 0.72, "actual": "up", "correct": True, "date": "2026-03-03"},
        {"stock": stock, "prediction": "down", "confidence": 0.65, "actual": "up", "correct": False, "date": "2026-03-02"},
        {"stock": stock, "prediction": "up", "confidence": 0.80, "actual": "up", "correct": True, "date": "2026-03-01"},
    ]
    return mock_history[:limit]
