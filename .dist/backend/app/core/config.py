import os
from typing import List, Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "FinAI Trader"
    API_V1_STR: str = "/api"
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]

    # ── Database ────────────────────────────────────────────
    # Set DATABASE_URL to use PostgreSQL in production.
    # Defaults to a local SQLite file for zero-config local dev.
    DATABASE_URL: Optional[str] = None

    # Legacy PostgreSQL env vars (still read for compatibility)
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_USER: str = "finai"
    POSTGRES_PASSWORD: str = "finai"
    POSTGRES_DB: str = "finai_trader"

    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    # ── JWT ─────────────────────────────────────────────────
    JWT_SECRET_KEY: str = "finai-dev-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # ── Exchange ─────────────────────────────────────────────
    EXCHANGE_API_KEY: Optional[str] = None
    EXCHANGE_API_SECRET: Optional[str] = None

    # ── Social Media ─────────────────────────────────────────
    TWITTER_BEARER_TOKEN: Optional[str] = None
    REDDIT_CLIENT_ID: Optional[str] = None
    REDDIT_CLIENT_SECRET: Optional[str] = None

    # ── BigQuery ─────────────────────────────────────────────
    GCP_PROJECT_ID: Optional[str] = None
    BIGQUERY_DATASET: str = "bigquery-public-data.crypto_bitcoin"
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None

    model_config = {
        "case_sensitive": True,
        "env_file": ".env",
        "extra": "ignore",
    }


settings = Settings()

# Resolve database URI
if not settings.SQLALCHEMY_DATABASE_URI:
    if settings.DATABASE_URL:
        settings.SQLALCHEMY_DATABASE_URI = settings.DATABASE_URL
    else:
        # Default: SQLite file in backend directory (zero-config)
        db_path = os.path.join(os.path.dirname(__file__), "..", "..", "finai_trader.db")
        db_path = os.path.abspath(db_path)
        settings.SQLALCHEMY_DATABASE_URI = f"sqlite:///{db_path}"
