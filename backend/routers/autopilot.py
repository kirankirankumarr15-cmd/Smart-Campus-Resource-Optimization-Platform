"""Autopilot router — runs the optimization pipeline (Admin only)."""
from fastapi import APIRouter, Depends
from routers.auth import require_roles
from services.prediction import predict_occupancy
from services.optimization import optimize
from services.safety_classifier import classify
from datetime import datetime, timezone
import json, os, random

router = APIRouter()

@router.post("/run")
def run_autopilot(user: dict = Depends(require_roles("campus_management", "it_administration"))):
    """Execute the 7-step pipeline. Returns ranked actions + tags."""
    base = os.path.join(os.path.dirname(__file__), "..", "..", "mock")
    rooms = json.load(open(os.path.join(base, "rooms.json")))
    timetable = json.load(open(os.path.join(base, "timetable.json")))
    logs = json.load(open(os.path.join(base, "access_logs.json")))
    sensors = json.load(open(os.path.join(base, "sensor_readings.json")))

    # Convert ts strings → datetime (mock simplification)
    for log in logs:
        if isinstance(log.get("ts"), str):
            log["ts"] = datetime.fromisoformat(log["ts"].replace("Z", "+00:00"))

    now = datetime.now(timezone.utc)
    # Step 1-2: ingestion + prediction
    predictions = predict_occupancy(timetable, logs, sensors, rooms, now)

    # Step 3: optimization
    dept_weights = {"CSE": 1.0, "ECE": 1.0, "MECH": 1.0, "CIVIL": 1.0, "ISE": 1.0}
    actions = optimize(predictions, rooms, dept_weights, last_run_dept_actions={})

    # Step 4-5: safety classify
    auto_count, approval_count = 0, 0
    classified = []
    for a in actions[:12]:  # cap to top 12 for demo
        tag = classify(a)
        if tag == "REJECT":
            continue
        classified.append({
            "id": random.randint(10000, 99999),
            "room_id": a.room_id,
            "action_type": a.action_type,
            "title": a.title,
            "reason": a.reason,
            "impact_metric": a.impact_metric,
            "impact_value": a.impact_value,
            "confidence": a.confidence,
            "score": a.score,
            "safety_tag": tag,
            "params": a.params,
            "affected_occupants": a.affected_occupants,
        })
        if tag == "AUTO":
            auto_count += 1
        else:
            approval_count += 1

    return {
        "run_id": random.randint(1000, 9999),
        "started_at": now.isoformat(),
        "total_actions": len(classified),
        "auto_applied": auto_count,
        "pending_approval": approval_count,
        "actions": classified,
        "energy_saved_kwh": round(sum(a["impact_value"] for a in classified
                                      if a["impact_metric"] == "kWh saved"), 1),
        "rooms_optimized": len(set(a["room_id"] for a in classified)),
    }
