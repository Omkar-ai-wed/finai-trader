from datetime import datetime
from pydantic import BaseModel


class WalletScanRequest(BaseModel):
    wallet_address: str
    chain: str = "bitcoin"


class FraudAlertOut(BaseModel):
    id: int
    wallet_address: str
    risk_score: float
    alert_type: str
    metadata: dict
    created_at: datetime

    class Config:
        from_attributes = True
