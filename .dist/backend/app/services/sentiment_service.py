"""
Sentiment Service
-----------------
Wraps the FinBERT / RoBERTa model for sentiment analysis.
Falls back to lexicon-based mock when the model is not loaded.
"""

import random
from typing import List, Dict

# Lazy-load the heavy ML model only when needed
_model = None


def _get_model():
    global _model
    if _model is None:
        try:
            from ml_models.sentiment_model import sentiment_model
            _model = sentiment_model
        except Exception:
            _model = None
    return _model


_FINANCIAL_TEXTS = {
    "bitcoin": [
        "Bitcoin reaching new ATH soon, institutional buying pressure is insane! 🚀",
        "BTC consolidating near support, watching $65k closely",
        "Crypto winter might not be over, macro headwinds persist",
        "Bitcoin ETF inflows breaking records this week",
        "Selling the news on BTC, risk-off environment",
        "Long BTC at current levels, RSI oversold",
        "Bitcoin network hash rate hitting all-time highs, bullish signal",
        "Regulatory concerns weighing on crypto markets today",
    ],
    "ethereum": [
        "ETH staking yields looking attractive for long-term holders",
        "Ethereum gas fees spiking, DeFi activity surging",
        "ETH/BTC ratio breaking down, rotation into BTC",
        "Layer 2 solutions boosting Ethereum ecosystem significantly",
    ],
}
_DEFAULT_TEXTS = [
    "Market looks bullish, strong buy signals across the board",
    "Uncertain times, holding cash and watching",
    "Bearish divergence on the charts, potential pullback ahead",
    "Volume confirming the breakout, momentum is strong",
    "Weak hands shaking out, long-term holders accumulating",
]


def _mock_predict(text: str) -> tuple[str, float]:
    """Lexicon fallback when the transformer model isn't available."""
    bullish_words = {"moon", "bullish", "breakout", "ath", "buy", "long", "surge", "strong", "high", "inflow", "accumulating"}
    bearish_words = {"bearish", "dump", "crash", "sell", "short", "weak", "down", "pullback", "concern", "winter"}
    text_lower = text.lower()
    bull_count = sum(1 for w in bullish_words if w in text_lower)
    bear_count = sum(1 for w in bearish_words if w in text_lower)
    if bull_count > bear_count:
        return "bullish", round(random.uniform(0.6, 0.95), 3)
    elif bear_count > bull_count:
        return "bearish", round(random.uniform(0.6, 0.9), 3)
    return "neutral", round(random.uniform(0.5, 0.75), 3)


def get_sample_texts(query: str, limit: int = 10) -> List[str]:
    """Generate sample financial texts for a given query (mocks Twitter/Reddit)."""
    pool = _FINANCIAL_TEXTS.get(query.lower(), _DEFAULT_TEXTS)
    # Expand pool with query-specific variations
    expanded = pool + [
        f"{query} looking strong technically",
        f"Selling pressure on {query} today",
        f"Neutral on {query}, waiting for confirmation",
        f"{query} price action suggests accumulation phase",
        f"Macro factors affecting {query} negatively",
        f"Institutional interest in {query} growing",
    ]
    random.shuffle(expanded)
    return expanded[:min(limit, len(expanded))]


def analyze_text(texts: List[str]) -> List[Dict]:
    model = _get_model()
    results = []
    for text in texts:
        if model is not None:
            try:
                label, score = model.predict(text)
            except Exception:
                label, score = _mock_predict(text)
        else:
            label, score = _mock_predict(text)
        results.append({"text": text, "label": label, "score": score})
    return results


def analyze_query(query: str, limit: int = 20) -> List[Dict]:
    """Full pipeline: fetch texts → analyze sentiment."""
    texts = get_sample_texts(query, limit)
    return analyze_text(texts)
