"""Scenario Simulator router."""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from routers.auth import get_current_user
import json, os, copy

router = APIRouter()

class ScenarioInput(BaseModel):
    block: str
    headcount: int
    time_window_min: int = 60

@router.post("/scenario")
def simulate(req: ScenarioInput, user: dict = Depends(get_current_user)):
    base = os.path.join(os.path.dirname(__file__), "..", "..", "mock")
    rooms = json.load(open(os.path.join(base, "rooms.json")))

    current = copy.deepcopy(rooms)
    simulated = copy.deepcopy(rooms)

    # Inject headcount into the requested block
    block_rooms = [r for r in simulated if r["block"] == req.block]
    if block_rooms:
        load_per_room = req.headcount / len(block_rooms)
        for r in block_rooms:
            ratio = load_per_room / max(r["capacity"], 1)
            r["current_occupancy"] = int(load_per_room)
            if ratio > 0.85:
                r["status"] = "crowded"
            elif ratio > 0.5:
                r["status"] = "moderate"
            else:
                r["status"] = "free"

    delta_kwh = round(0.05 * req.headcount, 1)
    delta_crowd = round(req.headcount / max(sum(r["capacity"] for r in block_rooms), 1) * 100, 1)

    return {
        "current": current,
        "simulated": simulated,
        "delta": {
            "energy_kwh": delta_kwh,
            "crowd_pct": delta_crowd,
            "utilization_pct": round(delta_crowd * 0.7, 1),
        },
    }
