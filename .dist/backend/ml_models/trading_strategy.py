"""
Trading Strategy — Backtrader strategy with graceful fallback.
Safe to import even without backtrader installed.
"""

try:
    import backtrader as bt

    class SentimentTechStrategy(bt.Strategy):
        params = {
            "rsi_period": 14,
            "fast_ma": 12,
            "slow_ma": 26,
            "signal_ma": 9,
            "sentiment_weight": 0.4,
            "tech_weight": 0.6,
        }

        def __init__(self):
            self.dataclose = self.datas[0].close
            self.rsi = bt.indicators.RSI(self.datas[0], period=self.p.rsi_period)
            self.macd = bt.indicators.MACD(
                self.datas[0],
                period_me1=self.p.fast_ma,
                period_me2=self.p.slow_ma,
                period_signal=self.p.signal_ma,
            )
            self.sma = bt.indicators.SimpleMovingAverage(self.datas[0], period=20)
            self.sentiment = 0.0

        def next(self):
            if self.position:
                if self.sentiment < 0 or self.dataclose[0] < self.sma[0]:
                    self.close()
            else:
                tech_score = 0
                if self.rsi[0] < 30:
                    tech_score += 1
                if self.macd.macd[0] > self.macd.signal[0]:
                    tech_score += 1
                if self.dataclose[0] > self.sma[0]:
                    tech_score += 1
                combined = (
                    self.p.tech_weight * (tech_score / 3.0)
                    + self.p.sentiment_weight * max(self.sentiment, 0)
                )
                if combined > 0.6:
                    self.buy()

except ImportError:
    # Backtrader not installed — expose a stub that the backtest route handles
    class SentimentTechStrategy:  # type: ignore
        """Stub used when backtrader is not installed."""
        pass
