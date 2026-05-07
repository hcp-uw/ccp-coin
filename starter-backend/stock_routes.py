from fastapi import APIRouter
import yfinance as yf

router = APIRouter()


@router.get("/stock/price")
async def get_stock_price(ticker: str = ""):
    """
    Returns the latest price for a given stock ticker.

    Always returns a clean JSON response — never crashes on bad tickers,
    empty input, or yfinance failures.

    Query parameter:
        ticker — stock symbol (e.g. AAPL, TSLA). Required.
    """
    ticker = ticker.strip().upper()

    if not ticker:
        return {"ticker": None, "price": None, "error": "ticker is required"}

    if not ticker.isalpha() or len(ticker) > 10:
        return {"ticker": ticker, "price": None, "error": "invalid ticker format"}

    try:
        data = yf.Ticker(ticker)
        price = data.fast_info.last_price

        if price is None:
            return {"ticker": ticker, "price": None, "error": "no price data found"}

        return {"ticker": ticker, "price": round(float(price), 2), "error": None}

    except Exception:
        return {"ticker": ticker, "price": None, "error": "failed to fetch price"}
