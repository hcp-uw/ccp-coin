from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from ai_routes import router as ai_router
from stock_routes import router as stock_router

load_dotenv()

app = FastAPI()
app.include_router(ai_router)
app.include_router(stock_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "API running",
        "docs": "/docs"
    }