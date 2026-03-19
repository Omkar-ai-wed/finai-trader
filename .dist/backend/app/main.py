from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import auth, trade, sentiment, fraud
from app.db.base import Base
from app.db.session import engine
from app.services.websocket_manager import (
    market_ws_manager,
    sentiment_ws_manager,
    fraud_ws_manager,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(trade.router, prefix=settings.API_V1_STR)
app.include_router(sentiment.router, prefix=settings.API_V1_STR)
app.include_router(fraud.router, prefix=settings.API_V1_STR)


@app.websocket("/ws/market")
async def ws_market(websocket: WebSocket):
    await market_ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # keep connection alive
    except WebSocketDisconnect:
        market_ws_manager.disconnect(websocket)


@app.websocket("/ws/sentiment")
async def ws_sentiment(websocket: WebSocket):
    await sentiment_ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        sentiment_ws_manager.disconnect(websocket)


@app.websocket("/ws/fraud")
async def ws_fraud(websocket: WebSocket):
    await fraud_ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        fraud_ws_manager.disconnect(websocket)
