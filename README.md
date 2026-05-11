# ScoreKu

**Your Alternative Credit Score** — AI-powered credit scoring for Malaysians without traditional bank history.

## Overview

ScoreKu uses alternative data (e-wallet transactions, bill payments, digital footprint) to generate fair credit scores for the underbanked population in Malaysia. Built with explainable AI so users understand exactly what affects their score.

![ScoreKu Dashboard](screenshots/scoreku-dashboard.jpg)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, TailwindCSS, Framer Motion, Recharts |
| Backend | Node.js, Express, MongoDB, JWT Auth |
| ML Model | Python, XGBoost, SHAP (explainability) |
| Data | 10,000 synthetic Malaysian credit profiles |

## Project Structure

```
scoreku/
├── frontend/          # React SPA
│   ├── src/
│   │   ├── pages/     # Landing, Login, Register, ScoreForm, Dashboard
│   │   ├── context/   # Auth context
│   │   └── services/  # API client
│   └── ...
├── backend/           # Express API
│   ├── controllers/   # Auth, Score logic
│   ├── models/        # User, ScoreResult (Mongoose)
│   ├── routes/        # API routes
│   └── server.js
├── ml-model/          # Python ML pipeline
│   ├── train_model.py # Training script
│   ├── predict.py     # Prediction API
│   ├── model.joblib   # Trained model
│   └── feature_importance.json
└── data/              # Raw dataset
```

## Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
npm install
# Configure .env (MONGO_URI, JWT_SECRET)
node server.js
```

### ML Model
```bash
cd ml-model
pip install -r requirements.txt
python train_model.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features

- **Alternative Data Scoring** — Uses e-wallet, bill payments, e-commerce activity
- **Explainable AI** — SHAP values show feature contributions
- **Multi-step Form** — Guided data input with progress tracking
- **Score Dashboard** — Visual gauge, risk category, improvement tips
- **Malaysian Context** — States, DuitNow, local employment types

## Model Performance

| Metric | Value |
|--------|-------|
| Accuracy | 89.1% |
| AUC-ROC | 91.4% |
| Precision | 68.0% |
| Recall | 51.7% |

## Team

Built for hackathon submission.

## License

MIT
