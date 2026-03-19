from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.sentiment import SentimentAnalyzeRequest, SentimentResult
from app.services.sentiment_service import analyze_query, analyze_text
from app.services.websocket_manager import sentiment_ws_manager
from app.db.models import SentimentRecord

router = APIRouter(prefix="/sentiment", tags=["sentiment"])


@router.post("/analyze", response_model=list[SentimentResult])
async def analyze_sentiment(
    req: SentimentAnalyzeRequest,
    user=Depends(deps.require_role("user")),
    db: Session = Depends(deps.get_db),
):
    results = analyze_query(req.query, req.limit)
    
    # Persist records in background
    for r in results[:5]:  # persist first 5 to avoid DB overload
        record = SentimentRecord(
            source="twitter",
            text=r["text"],
            label=r["label"],
            score=r["score"],
        )
        db.add(record)
    db.commit()

    # Broadcast to WebSocket listeners
    await sentiment_ws_manager.broadcast_json({
        "type": "sentiment_update",
        "query": req.query,
        "results": [{"label": r["label"], "score": r["score"]} for r in results],
    })

    return [SentimentResult(label=r["label"], score=r["score"]) for r in results]


@router.post("/texts", response_model=list[SentimentResult])
async def analyze_custom_texts(
    payload: dict,
    user=Depends(deps.require_role("user")),
):
    """Analyze a list of user-provided texts."""
    texts = payload.get("texts", [])
    results = analyze_text(texts)
    return [SentimentResult(label=r["label"], score=r["score"]) for r in results]


@router.post("/train")
async def train_sentiment_model(user=Depends(deps.require_role("admin"))):
    """Placeholder: fine-tune FinBERT/RoBERTa on your dataset."""
    return {
        "status": "training_started",
        "message": "Fine-tuning job queued. ETA: ~2 hours on GPU.",
    }


@router.get("/history")
async def sentiment_history(
    limit: int = 50,
    user=Depends(deps.require_role("user")),
    db: Session = Depends(deps.get_db),
):
    records = db.query(SentimentRecord).order_by(SentimentRecord.created_at.desc()).limit(limit).all()
    return [
        {
            "id": r.id,
            "text": r.text,
            "label": r.label,
            "score": r.score,
            "source": r.source,
            "created_at": r.created_at.isoformat(),
        }
        for r in records
    ]
