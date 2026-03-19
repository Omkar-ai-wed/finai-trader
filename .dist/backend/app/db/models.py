from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Float,
    Boolean,
    Text,
    ForeignKey,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    roles = Column(String, default="user")  # comma-separated: "user,admin"
    created_at = Column(DateTime, default=datetime.utcnow)


class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    encrypted_key = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symbol = Column(String, nullable=False)
    side = Column(String, nullable=False)  # BUY / SELL
    quantity = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    pnl = Column(Float, default=0.0)

    user = relationship("User")


class SentimentRecord(Base):
    __tablename__ = "sentiments"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String, nullable=False)  # twitter / reddit
    text = Column(Text, nullable=False)
    label = Column(String, nullable=False)  # bullish / neutral / bearish
    score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class FraudAlert(Base):
    __tablename__ = "fraud_alerts"

    id = Column(Integer, primary_key=True, index=True)
    wallet_address = Column(String, index=True)
    risk_score = Column(Float)
    alert_type = Column(String)  # rug_pull / laundering / cluster
    # Use Text instead of JSON for SQLite compatibility; avoid 'metadata' name
    extra_data = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow)

    def get_extra(self) -> dict:
        import json
        try:
            return json.loads(self.extra_data or "{}")
        except Exception:
            return {}

    def set_extra(self, value: dict):
        import json
        self.extra_data = json.dumps(value)
