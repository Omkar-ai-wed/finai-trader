from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TradeStartRequest(BaseModel):
    symbol: str = "BTCUSDT"
    base_quantity: float = 0.001


class TradeStatus(BaseModel):
    symbol: str
    current_price: float
    rsi: float
    macd: float
    ma_20: float
    sentiment_score: float
    signal: str
    portfolio_value: float
    profit_loss: float


class TradeRecord(BaseModel):
    id: int
    symbol: str
    side: str
    quantity: float
    price: float
    pnl: float
    timestamp: str

    class Config:
        from_attributes = True
