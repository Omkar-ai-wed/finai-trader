from datetime import datetime
from pydantic import BaseModel


class SentimentAnalyzeRequest(BaseModel):
    query: str = "bitcoin"
    limit: int = 50


class SentimentResult(BaseModel):
    label: str
    score: float


class SentimentRecordOut(BaseModel):
    id: int
    source: str
    text: str
    label: str
    score: float
    created_at: datetime

    class Config:
        from_attributes = True
