from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from ai_routes import router as ai_router
from monitoring import MonitoringMiddleware
from database import create_db_pool

load_dotenv()

app = FastAPI()
app.add_middleware(MonitoringMiddleware)
app.include_router(ai_router)


@app.on_event("startup")
async def startup():
    app.db_pool = await create_db_pool()


@app.on_event("shutdown")
async def shutdown():
    await app.db_pool.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
