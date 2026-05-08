"""Smart Maintenance Scheduler router."""
from fastapi import APIRouter, Depends
from routers.auth import get_current_user
import json, os
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/schedule")
def maintenance_schedule(user: dict = Depends(get_current_user)):
    base = os.path.join(os.path.dirname(__file__), "..", "..", "mock")
    rooms = json.load(open(os.path.join(base, "rooms.json")))

    # Find usage troughs (rooms with status idle/free) → suggest slots
    suggestions = []
    now = datetime.utcnow()
    for r in rooms[:20]:
        if r["status"] in ("idle", "free"):
            priority = "urgent" if r.get("days_since_check", 0) > 60 else \
                       "routine" if r.get("days_since_check", 0) > 30 else \
                       "opportunistic"
            suggestions.append({
                "room_id": r["id"],
                "room_code": r["code"],
                "block": r["block"],
                "priority": priority,
                "window_start": (now + timedelta(hours=2)).isoformat(),
                "window_end": (now + timedelta(hours=4)).isoformat(),
                "trough_confidence": 0.78,
                "assigned_team": "facility_maintenance",
                "status": "scheduled",
            })
    return {"slots": suggestions}
