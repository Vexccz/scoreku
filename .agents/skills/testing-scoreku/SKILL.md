---
name: testing-scoreku
description: End-to-end testing for ScoreKu (alternative credit scoring app). Use when verifying frontend, backend API, or ML model changes.
---

# Testing ScoreKu

## Architecture

- **Frontend**: React + Vite (port 5173)
- **Backend**: Node.js/Express (port 5000) — requires MongoDB
- **ML Model**: Python/Flask (port 8000) — requires trained `model.joblib`

## Local Dev Setup

### 1. Install MongoDB
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update -qq && sudo apt-get install -y mongodb-org
sudo mongod --dbpath /var/lib/mongodb --fork --logpath /var/log/mongodb/mongod.log
```

### 2. Install Python ML dependencies
```bash
pip3 install -r ml-model/requirements.txt
```

### 3. Set up backend environment
```bash
cd backend && cp .env.example .env
# Edit .env with real credentials if needed (GROQ_API_KEY for AI chat)
```

### 4. Start all services
```bash
# Terminal 1 — ML Model (must start first for ML scoring)
cd ml-model && python3 app.py
# Verify: curl http://localhost:8000/health

# Terminal 2 — Backend
cd backend && node server.js
# Verify: curl http://localhost:5000/api/health

# Terminal 3 — Frontend (point to local backend)
cd frontend && VITE_API_URL=http://localhost:5000/api npm run dev
# Opens at http://localhost:5173
```

## Key Test Paths

### Score Calculation (Primary Flow)
1. Navigate to `/welcome` (onboarding) → complete steps → lands on `/score`
2. Fill 4-step form: Income → Payments → Bills → Activity
3. Click "Get My Score" → navigates to `/dashboard` with results
4. Verify DB record: `mongosh --quiet --eval "db.scoreresults.find().sort({_id:-1}).limit(1).pretty()" scoreku`

### Heuristic Fallback Testing
- Stop ML server → submit score → should fallback to heuristic algorithm
- Response should have `is_ai_powered: false`
- Risk categories from heuristic: Excellent (≥76), Fair (≥56), Moderate Risk (≥31), High Risk (<31)

### API Endpoints
- `POST /api/score` — submit score (main endpoint)
- `GET /api/health` — health check
- `GET localhost:8000/health` — ML model health
- `GET localhost:8000/debug-load` — ML model debug info
- `POST localhost:8000/predict` — direct ML prediction

### Frontend Pages to Test
- `/welcome` — Onboarding (first visit, sets localStorage flag)
- `/` — Landing page (requires onboarding complete)
- `/score` — Score form (4-step wizard)
- `/dashboard` — Results display
- `/history` — Score history chart
- `/login` and `/register` — Auth pages
- `/connect-bank` — Bank connection flow

## Common Issues

- **OnboardingGuard**: App redirects to `/welcome` if `localStorage.getItem('scoreku_onboarded')` is not set. Complete onboarding first or set it manually.
- **GROQ_API_KEY**: The AI chat widget needs a real Groq API key to give meaningful responses. Without it, responses show "Masalah konfigurasi API Key". The local knowledge base still works for pattern-matched questions.
- **Frontend API URL**: By default, frontend points to `https://scoreku.onrender.com/api`. Override with `VITE_API_URL=http://localhost:5000/api` when running locally.
- **model.joblib**: The trained ML model file must exist in `ml-model/`. If missing, run `python3 ml-model/train_model.py` to generate it.

## Devin Secrets Needed

- `GROQ_API_KEY` — For AI chat widget functionality (optional, app works without it)
- `MONGO_URI` — MongoDB connection string (defaults to `mongodb://localhost:27017/scoreku`)

## Lint & Build
```bash
cd frontend && npm run lint   # ESLint check
cd frontend && npm run build  # Production build
```

The default branch is `master` (not `main`).
