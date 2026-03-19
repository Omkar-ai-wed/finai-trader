from typing import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.db.session import SessionLocal

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return {"email": payload.get("sub"), "roles": payload.get("roles", [])}


def require_role(required: str):
    def _require(user=Depends(get_current_user)):
        roles = user.get("roles", [])
        if required not in roles and "admin" not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user

    return _require
