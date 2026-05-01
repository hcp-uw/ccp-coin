# CCP Coin

A stock prediction game where users bet virtual coins on AI-generated stock forecasts. Users sign up, receive a daily AI prediction for a stock (up/down), place a virtual coin bet, and earn or lose coins based on whether the prediction was correct. A leaderboard tracks top performers.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python), Uvicorn |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI/ML | AWS SageMaker (daily predictions), yfinance |
| Storage | AWS S3 (prediction results) |
| Monitoring | AWS CloudWatch |
| Testing | pytest (backend), Vitest + Playwright (frontend) |

---

## Project Structure

- `frontend/` — Next.js app, talks directly to Supabase
- `starter-backend/` — FastAPI backend, serves AI predictions

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- pip
- A [Supabase](https://supabase.com) account and project
- (Optional) AWS account for SageMaker/S3/CloudWatch

---

## Installation

**Backend**
```bash
cd starter-backend
pip install -r requirements.txt
```

**Frontend**
```bash
cd frontend
npm install
```

---

## Environment Variables

**`starter-backend/.env`**
```
DB_HOST=your_supabase_host
DB_USER=your_supabase_user
DB_PASSWORD=your_supabase_password
DB_NAME=postgres

AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
```

**`frontend/.env.local`**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get Supabase credentials from: Dashboard → Settings → Database / API.

---

## Running the App

```bash
# Backend (from starter-backend/)
uvicorn main:app --reload

# Frontend (from frontend/, separate terminal)
npm run dev
```

- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/prediction/today` | Get today's AI prediction for a stock |
| GET | `/prediction/history` | Get past AI predictions for a stock |

**Query parameters:**
- `stock` — ticker symbol (default: `AAPL`)
- `limit` — number of history records to return (default: `10`, history only)

All other data operations (users, bets, leaderboard) are handled directly by the frontend via Supabase.

---

## MVP Features

- User registration and login (Supabase Auth)
- Daily AI stock prediction (up/down + confidence score)
- Virtual coin betting on predictions
- Prediction history and accuracy tracking
- Leaderboard of top coin earners
- AWS CloudWatch monitoring of API latency and errors

---

## Contributing

1. Fork the repo and create a branch from `main`
2. Make your changes in the branch
3. Run tests before opening a PR:
   ```bash
   # Backend tests
   cd starter-backend && pytest

   # Frontend tests
   cd frontend && npm test
   ```
4. Open a pull request with `base: main` and describe your changes
