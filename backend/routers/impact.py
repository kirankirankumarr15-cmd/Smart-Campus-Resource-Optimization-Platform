"""Impact metrics router."""
from fastapi import APIRouter, Depends
from routers.auth import get_current_user
import random

router = APIRouter()

@router.get("/metrics")
def metrics(user: dict = Depends(get_current_user)):
    return {
        "energy_saved_kwh": 128.4,
        "rooms_optimized": 42,
        "crowd_score": 78,
        "sustainability_index": 84,
        "pending_approvals": 3,
        "sensors_online": 28,
        "sensors_total": 30,
    }

@router.get("/history")
def history(user: dict = Depends(get_current_user)):
    """Last 10 optimization runs — before/after series for the line chart."""
    runs = []
    for i in range(10):
        before = random.randint(180, 240)
        after  = before - random.randint(60, 130)
        runs.append({
            "run_id": 1000 + i,
            "label": f"Run {i+1}",
            "before_kwh": before,
            "after_kwh": after,
            "saving_kwh": before - after,
        })
    return {"runs": runs}
