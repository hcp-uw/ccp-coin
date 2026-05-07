from datetime import date
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_supabase_client

router = APIRouter()


class PredictionResponse(BaseModel):
    stock: str
    prediction: str
    confidence: float


@router.get("/prediction/today")
async def get_prediction(stock: str = "AAPL"):
    """
    Returns today's AI prediction for a given stock from the ai_predictions table.
    """
    supabase = get_supabase_client()
    stock = stock.strip().upper()

    try:
        today = date.today().isoformat()

        result = (
            supabase.table("ai_predictions")
            .select("stock, prediction, confidence")
            .eq("stock", stock)
            .eq("date", today)
            .limit(1)
            .execute()
        )

        if not result.data:
            raise HTTPException(
                status_code=404,
                detail=f"No prediction found for {stock} today"
            )

        row = result.data[0]
        return PredictionResponse(
            stock=row["stock"],
            prediction=row["prediction"],
            confidence=row["confidence"],
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch prediction: {str(e)}")


@router.get("/prediction/history")
async def get_prediction_history(stock: str = "AAPL", limit: int = 10):
    """
    Returns past AI predictions for a given stock from the ai_predictions table.
    """
    supabase = get_supabase_client()
    stock = stock.strip().upper()

    try:
        result = (
            supabase.table("ai_predictions")
            .select("stock, prediction, confidence, actual, correct, date")
            .eq("stock", stock)
            .order("date", desc=True)
            .limit(limit)
            .execute()
        )

        return result.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")
