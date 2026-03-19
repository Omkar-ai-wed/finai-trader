# FinAI Trader 🤖📈

An **AI-powered full-stack FinTech platform** with real-time algorithmic trading, sentiment analysis, and DeFi fraud detection.

---

## Features

| Module | Description |
|--------|-------------|
| 📈 **Trading Bot** | Real-time crypto trading with RSI, MACD, MA-20 indicators + NLP sentiment fusion |
| 🧠 **Sentiment AI** | FinBERT/RoBERTa sentiment analysis on financial text; live WebSocket feed |
| 🔍 **DeFi Fraud Detection** | Graph Neural Network–based wallet risk scoring; live alert stream |
| ⛓ **Blockchain Explorer** | Block/transaction browser with network stats |
| ⏮ **Backtesting** | Backtrader strategy testing with equity curve visualisation |
| ⚙ **Settings** | Encrypted API key management, JWT config, preferences |

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14, TailwindCSS v3, Recharts, WebSocket |
| **Backend** | Python FastAPI, Uvicorn, WebSocket, JWT auth |
| **AI / ML** | HuggingFace Transformers (FinBERT), PyTorch, PyTorch Geometric, NetworkX |
| **Trading** | Backtrader, pandas, numpy |
| **Database** | PostgreSQL 16, SQLAlchemy, Alembic |
| **Blockchain** | Google BigQuery Crypto Public Dataset |
| **Deployment** | Docker, Docker Compose |

---

## Project Structure

```
FinTech/
├── docker-compose.yml
├── .env.example
└── .dist/
    ├── backend/
    │   ├── app/
    │   │   ├── api/
    │   │   │   ├── deps.py               # Auth dependencies
    │   │   │   └── routes/
    │   │   │       ├── auth.py           # POST /api/auth/{login,register}
    │   │   │       ├── trade.py          # POST /api/trade/{start,stop,backtest,stocks/*}
    │   │   │       ├── sentiment.py      # POST /api/sentiment/{analyze,train}
    │   │   │       └── fraud.py          # POST /api/fraud/{scan_wallet,detect_pattern}
    │   │   ├── core/
    │   │   │   ├── config.py             # Pydantic settings
    │   │   │   └── security.py           # JWT encode/decode, bcrypt
    │   │   ├── db/
    │   │   │   ├── models.py             # SQLAlchemy models
    │   │   │   └── session.py            # Engine + SessionLocal
    │   │   ├── services/
    │   │   │   ├── trading_engine.py     # GBM price sim, RSI/MACD/MA, signal logic
    │   │   │   ├── sentiment_service.py  # FinBERT + lexicon fallback
    │   │   │   ├── fraud_service.py      # Graph building + GNN/heuristic scoring
    │   │   │   └── websocket_manager.py  # ConnectionManager × 3
    │   │   └── main.py                   # FastAPI app + WS endpoints
    │   ├── ml_models/
    │   │   ├── sentiment_model.py        # FinBERT wrapper
    │   │   ├── fraud_detection_gnn.py    # PyTorch Geometric GCN
    │   │   └── trading_strategy.py       # Backtrader SentimentTech strategy
    │   ├── requirements.txt
    │   └── Dockerfile
    └── frontend/
        ├── app/
        │   ├── page.tsx                  # Dashboard
        │   ├── trading-bot/page.tsx      # Trading Bot
        │   ├── sentiment/page.tsx        # Sentiment Analysis
        │   ├── defi-fraud/page.tsx       # DeFi Fraud Detection
        │   ├── backtesting/page.tsx      # Backtesting
        │   ├── blockchain-explorer/page.tsx
        │   └── settings/page.tsx
        ├── components/
        │   ├── Sidebar.tsx
        │   ├── DashboardCards.tsx
        │   ├── PriceChart.tsx            # Area chart + RSI/MACD indicators
        │   ├── SentimentGauge.tsx        # Arc radial gauge
        │   ├── NetworkGraph.tsx          # SVG circular layout graph
        │   ├── TradeHistoryTable.tsx
        │   ├── SentimentTrendChart.tsx
        │   └── BacktestChart.tsx
        ├── tailwind.config.ts
        ├── package.json
        └── Dockerfile
```

---

## Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended)
- **OR** Node.js 20+, Python 3.11+, PostgreSQL 16

---

### Option A — Docker Compose (Recommended)

```bash
# 1. Clone / open the project
cd d:\play\FinTech

# 2. Copy environment file
copy .env.example .env
# Edit .env and fill in your API keys (see below)

# 3. Start all services
docker compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:8000
# API Docs → http://localhost:8000/docs
```

---

### Option B — Local Development

#### Backend

```powershell
# From project root
cd .dist\backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Set env vars (copy .env.example → .env in backend dir)
copy ..\..\\.env.example .env

# Run migrations (auto-creates tables on startup via SQLAlchemy)
# Ensure PostgreSQL is running on localhost:5432

# Start server
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```powershell
cd .dist\frontend

# Install dependencies
npm install

# Set public vars
$env:NEXT_PUBLIC_API_BASE = "http://localhost:8000/api"
$env:NEXT_PUBLIC_WS_BASE  = "ws://localhost:8000"

# Start dev server
npm run dev
# → http://localhost:3000
```

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Trading Bot
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trade/start` | Start trading bot |
| POST | `/api/trade/stop` | Stop trading bot |
| POST | `/api/trade/backtest` | Run Backtrader backtest |
| GET  | `/api/trade/history` | Get trade history |
| POST | `/api/trade/stocks/start` | Stream stock prices |
| POST | `/api/trade/stocks/stop` | Stop stock stream |

### Sentiment Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sentiment/analyze` | Analyze query sentiment |
| POST | `/api/sentiment/train` | Trigger model fine-tuning |
| GET  | `/api/sentiment/history` | Get stored sentiment records |

### DeFi Fraud Detection
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/fraud/scan_wallet` | Scan wallet for risk |
| POST | `/api/fraud/detect_pattern` | Batch fraud pattern scan |
| GET  | `/api/fraud/alerts` | Get alert history |

### WebSocket Streams
| WebSocket | Description |
|-----------|-------------|
| `ws://localhost:8000/ws/market` | Market prices, signals, trade history |
| `ws://localhost:8000/ws/sentiment` | Live sentiment updates |
| `ws://localhost:8000/ws/fraud` | Live fraud alerts |

---

## Environment Variables

See [`.env.example`](.env.example) for the full list. Key variables:

| Variable | Description |
|----------|-------------|
| `JWT_SECRET_KEY` | Secret for signing JWTs — **change in production!** |
| `EXCHANGE_API_KEY/SECRET` | Binance / Kraken exchange API keys |
| `TWITTER_BEARER_TOKEN` | Twitter API v2 bearer token |
| `GCP_PROJECT_ID` | Google Cloud project for BigQuery blockchain data |
| `NEXT_PUBLIC_API_BASE` | Frontend → backend URL |

---

## Security Notes

- JWT tokens expire after 60 minutes (configurable)
- API keys are stored encrypted in the `api_keys` table
- Role-based access: `user` and `admin` roles
- The backend Dockerfile runs as a non-root user
- **Never commit your `.env` file to version control**

---

## Demo Mode

The platform works fully in **demo mode without any API keys**:
- Trading bot simulates BTC price using GBM (Geometric Brownian Motion)
- Sentiment analysis uses a lexicon-based fallback classifier
- Fraud detection uses heuristic graph scoring
- Blockchain explorer shows realistic static sample data

To enable real data: fill in your API keys in `.env`.

---

## Interactive API Docs

FastAPI automatically generates Swagger docs:

```
http://localhost:8000/docs        # Swagger UI
http://localhost:8000/redoc       # ReDoc
```

---

## License

MIT © 2025 FinAI Trader
