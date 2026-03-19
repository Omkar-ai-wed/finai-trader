import asyncio
import json
import random
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect

from app.api import deps
from app.schemas.trade import TradeRecord

router = APIRouter(prefix="/trade", tags=["trade"])
