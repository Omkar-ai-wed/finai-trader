from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.fraud import WalletScanRequest, FraudAlertOut
from app.services.fraud_service import scan_wallet, detect_patterns, graph_to_json
from app.services.websocket_manager import fraud_ws_manager
from app.db.models import FraudAlert

router = APIRouter(prefix="/fraud", tags=["fraud"])


@router.post("/scan_wallet")
async def scan_wallet_route(
    req: WalletScanRequest,
    user=Depends(deps.require_role("user")),
    db: Session = Depends(deps.get_db),
):
    result = scan_wallet(req.wallet_address, req.chain)

    await fraud_ws_manager.broadcast_json(
        {
            "type": "fraud_alert",
            "wallet_address": req.wallet_address,
            "risk_score": result["risk_score"],
            "alert_type": result["alert_type"],
        }
    )

    # Persist alert
    alert = FraudAlert(
        wallet_address=req.wallet_address,
        risk_score=result["risk_score"],
        alert_type=result["alert_type"],
    )
    alert.set_extra({
        "transaction_count": result["transaction_count"],
        "chain": req.chain,
    })
    db.add(alert)
    db.commit()
    db.refresh(alert)

    return {
        "id": alert.id,
        "wallet_address": alert.wallet_address,
        "risk_score": alert.risk_score,
        "alert_type": alert.alert_type,
        "metadata": alert.get_extra(),
        "created_at": alert.created_at.isoformat(),
        "graph": result["graph_json"],
        "node_scores": result["node_scores"],
        "transaction_count": result["transaction_count"],
    }


@router.post("/detect_pattern")
async def detect_pattern(
    payload: dict = {},
    user=Depends(deps.require_role("user")),
):
    chain = payload.get("chain", "bitcoin") if payload else "bitcoin"
    patterns = detect_patterns(chain)
    for p in patterns:
        await fraud_ws_manager.broadcast_json({
            "type": "fraud_alert",
            "wallet_address": p["wallet"],
            "risk_score": p["risk_score"],
            "alert_type": p["pattern"],
        })
    return {"status": "completed", "patterns": patterns}


@router.get("/alerts")
async def get_alerts(
    limit: int = 20,
    user=Depends(deps.require_role("user")),
    db: Session = Depends(deps.get_db),
):
    alerts = db.query(FraudAlert).order_by(FraudAlert.created_at.desc()).limit(limit).all()
    return [
        {
            "id": a.id,
            "wallet_address": a.wallet_address,
            "risk_score": a.risk_score,
            "alert_type": a.alert_type,
            "created_at": a.created_at.isoformat(),
        }
        for a in alerts
    ]
