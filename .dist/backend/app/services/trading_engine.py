"""
Enhanced Trading Engine
-----------------------
Simulates real-time market data with RSI, MACD, and MA indicators.
In production, replace price feed with exchange WebSocket (e.g. Binance).
"""

import asyncio
import math
import random
from collections import deque
from datetime import datetime
from typing import Callable, Deque, List, Optional


def _ema(series: List[float], period: int) -> float:
    """Calculate EMA from a list of values."""
    if len(series) < period:
        return sum(series) / len(series)
    k = 2 / (period + 1)
    ema = series[0]
    for v in series[1:]:
        ema = v * k + ema * (1 - k)
    return ema


def _rsi(closes: List[float], period: int = 14) -> float:
    if len(closes) < period + 1:
        return 50.0
    gains, losses = [], []
    for i in range(1, len(closes)):
        diff = closes[i] - closes[i - 1]
        gains.append(max(diff, 0))
        losses.append(max(-diff, 0))
    avg_gain = sum(gains[-period:]) / period
    avg_loss = sum(losses[-period:]) / period
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))


def _macd(closes: List[float]) -> tuple[float, float]:
    """Returns (macd_line, signal_line)."""
    fast = _ema(closes, 12)
    slow = _ema(closes, 26)
    macd_line = fast - slow
    # Signal: EMA of MACD values (simplified single value)
    signal = macd_line * 0.85
    return macd_line, signal


class TradeRecord:
    def __init__(self, side: str, price: float, qty: float, pnl: float):
        self.side = side
        self.price = price
        self.qty = qty
        self.pnl = pnl
        self.timestamp = datetime.utcnow().isoformat()

    def to_dict(self) -> dict:
        return {
            "side": self.side,
            "price": round(self.price, 2),
            "qty": self.qty,
            "pnl": round(self.pnl, 2),
            "timestamp": self.timestamp,
        }


class TradingEngine:
    def __init__(self):
        self.running = False
        self.current_price = 0.0
        self.sentiment_score = 0.5
        self.portfolio_value = 10_000.0
        self.profit_loss = 0.0
        self._closes: Deque[float] = deque(maxlen=200)
        self.trade_history: List[TradeRecord] = []
        self._position = 0.0  # BTC held
        self._cash = 10_000.0
        self._base_price = 67_000.0

    @property
    def rsi(self) -> float:
        return _rsi(list(self._closes))

    @property
    def macd(self) -> float:
        if len(self._closes) < 10:
            return 0.0
        macd_line, _ = _macd(list(self._closes))
        return macd_line

    @property
    def macd_signal(self) -> float:
        if len(self._closes) < 10:
            return 0.0
        _, signal = _macd(list(self._closes))
        return signal

    @property
    def ma_20(self) -> float:
        closes = list(self._closes)
        if not closes:
            return 0.0
        window = closes[-20:] if len(closes) >= 20 else closes
        return sum(window) / len(window)

    def _simulate_price(self) -> float:
        """GBM-like price simulation."""
        mu = 0.00005
        sigma = 0.0015
        dt = 1
        prev = self._closes[-1] if self._closes else self._base_price
        drift = mu * dt
        shock = sigma * math.sqrt(dt) * random.gauss(0, 1)
        return max(prev * math.exp(drift + shock), 1.0)

    def _generate_signal(self) -> str:
        rsi_val = self.rsi
        macd_val = self.macd
        macd_sig = self.macd_signal
        price = self.current_price
        ma = self.ma_20
        sentiment = self.sentiment_score

        bull_signals = 0
        if rsi_val < 35:
            bull_signals += 1
        if macd_val > macd_sig:
            bull_signals += 1
        if price > ma:
            bull_signals += 1
        if sentiment > 0.6:
            bull_signals += 1

        bear_signals = 0
        if rsi_val > 65:
            bear_signals += 1
        if macd_val < macd_sig:
            bear_signals += 1
        if price < ma:
            bear_signals += 1
        if sentiment < 0.4:
            bear_signals += 1

        if bull_signals >= 3:
            return "BUY"
        elif bear_signals >= 3:
            return "SELL"
        return "HOLD"

    def _execute_trade(self, signal: str):
        price = self.current_price
        if signal == "BUY" and self._cash >= price * 0.001:
            qty = (self._cash * 0.1) / price  # invest 10% of cash
            self._position += qty
            self._cash -= qty * price
            pnl = 0.0
            self.trade_history.append(TradeRecord("BUY", price, round(qty, 6), pnl))
            if len(self.trade_history) > 100:
                self.trade_history.pop(0)
        elif signal == "SELL" and self._position > 0:
            qty = self._position * 0.5  # sell 50% of position
            proceeds = qty * price
            cost = qty * (price * 0.98)  # approximate cost basis
            pnl = proceeds - cost
            self._cash += proceeds
            self._position -= qty
            self.profit_loss += pnl
            self.trade_history.append(TradeRecord("SELL", price, round(qty, 6), round(pnl, 2)))
            if len(self.trade_history) > 100:
                self.trade_history.pop(0)

        self.portfolio_value = self._cash + (self._position * price)

    async def run(self, symbol: str, broadcast_cb: Callable):
        self.running = True
        self._cash = 10_000.0
        self._position = 0.0
        self._closes.clear()

        while self.running:
            price = self._simulate_price()
            self._closes.append(price)
            self.current_price = price

            signal = self._generate_signal()
            self._execute_trade(signal)

            await broadcast_cb(
                {
                    "type": "market_update",
                    "symbol": symbol,
                    "price": round(price, 2),
                    "signal": signal,
                    "rsi": round(self.rsi, 2),
                    "macd": round(self.macd, 4),
                    "macd_signal": round(self.macd_signal, 4),
                    "ma_20": round(self.ma_20, 2),
                    "sentiment_score": round(self.sentiment_score, 3),
                    "portfolio_value": round(self.portfolio_value, 2),
                    "profit_loss": round(self.profit_loss, 2),
                    "trade_history": [t.to_dict() for t in self.trade_history[-10:]],
                }
            )
            await asyncio.sleep(1)

    def stop(self):
        self.running = False

    def get_trade_history(self) -> List[dict]:
        return [t.to_dict() for t in self.trade_history]


trading_engine = TradingEngine()
