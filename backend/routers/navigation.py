"""Navigation router — Find Best Room For Me."""
from fastapi import APIRouter, Depends, Query
from routers.auth import get_current_user
import json, os, random

router = APIRouter()

@router.get("/available")
def find_rooms(
    capacity: int = Query(20, ge=1),
    block: str = Query("any"),
    user: dict = Depends(get_current_user),
):
    base = os.path.join(os.path.dirname(__file__), "..", "..", "mock")
    rooms = json.load(open(os.path.join(base, "rooms.json")))

    candidates = [r for r in rooms
                  if r["capacity"] >= capacity
                  and r["status"] in ("free", "moderate")
                  and (block == "any" or r["block"] == block)]

    # Score: prefer free over moderate, closer-to-needed-capacity
    for r in candidates:
        free_bonus = 1.0 if r["status"] == "free" else 0.7
        size_fit = 1.0 - min(abs(r["capacity"] - capacity) / max(r["capacity"], 1), 0.5)
        r["availability_confidence"] = round(free_bonus * size_fit * 100, 0)

    candidates.sort(key=lambda r: r["availability_confidence"], reverse=True)
    return {"results": candidates[:5], "query": {"capacity": capacity, "block": block}}
