from fastapi import APIRouter, Query
import yfinance as yf

router = APIRouter()


def get_stock_price(ticker: str):
    stock = yf.Ticker(ticker)
    hist = stock.history(period="1d")

    if hist.empty:
        return None

    return float(hist["Close"].iloc[-1])


@router.get("/stock/price")
async def stock_price(ticker: str = Query("AAPL")):
    price = get_stock_price(ticker)

    if price is None:
        return {"error": "No data found"}

    return {
        "ticker": ticker.upper(),
        "price": price
    }