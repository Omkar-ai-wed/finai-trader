"""
Sentiment Model — FinBERT wrapper with graceful fallback.
Loads lazily; safe to import even without torch/transformers installed.
"""

import random


class _MockSentimentModel:
    """Lexicon-based fallback when transformers is not installed."""

    _BULLISH = {"moon", "bullish", "breakout", "ath", "buy", "long", "surge",
                "strong", "high", "inflow", "accumulating", "rally", "up"}
    _BEARISH = {"bearish", "dump", "crash", "sell", "short", "weak", "down",
                "pullback", "concern", "winter", "drop", "fear", "risk"}

    def predict(self, text: str) -> tuple[str, float]:
        words = set(text.lower().split())
        bull = len(words & self._BULLISH)
        bear = len(words & self._BEARISH)
        if bull > bear:
            return "bullish", round(random.uniform(0.65, 0.95), 3)
        elif bear > bull:
            return "bearish", round(random.uniform(0.65, 0.90), 3)
        return "neutral", round(random.uniform(0.55, 0.80), 3)

    def eval(self):
        return self


class _FinBERTModel:
    """HuggingFace FinBERT wrapper — loaded only when torch+transformers available."""

    def __init__(self):
        from transformers import AutoTokenizer, AutoModelForSequenceClassification
        import torch as _torch
        self._torch = _torch
        self.tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
        self.model = AutoModelForSequenceClassification.from_pretrained("ProsusAI/finbert")
        self.model.eval()
        self.id2label = {0: "bearish", 1: "neutral", 2: "bullish"}

    def predict(self, text: str) -> tuple[str, float]:
        torch = self._torch
        with torch.no_grad():
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True)
            outputs = self.model(**inputs)
            probs = outputs.logits.softmax(dim=-1)[0]
            label_id = int(probs.argmax().item())
            score = float(probs[label_id].item())
        return self.id2label[label_id], score


def _load_model():
    try:
        return _FinBERTModel()
    except Exception:
        return _MockSentimentModel()


# Module-level sentinel — not loaded yet
sentiment_model: _MockSentimentModel | _FinBERTModel | None = None  # type: ignore


def get_sentiment_model():
    global sentiment_model
    if sentiment_model is None:
        sentiment_model = _load_model()
    return sentiment_model


# Backwards-compatible attribute — lazy
class _LazyProxy:
    """Allows `from ml_models.sentiment_model import sentiment_model` pattern."""
    def predict(self, text: str) -> tuple[str, float]:
        return get_sentiment_model().predict(text)


sentiment_model = _LazyProxy()  # type: ignore
