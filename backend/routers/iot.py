"""
IoT Sensors router — Feature 11
GET /iot/sensors           → list all sensors with status
GET /iot/sensors/{id}      → sensor detail + sparkline
GET /iot/readings/{room}   → aggregated readings for a room
GET /iot/alerts            → active alerts feed
POST /iot/command          → publish actuator command (Admin/IT/Energy only)
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from routers.auth import get_current_user, require_roles
import json, os, random
from datetime import datetime, timedelta

router = APIRouter()

def _load_sensors():
    base = os.path.join(os.path.dirname(__file__), "..", "..", "mock")
    return json.load(open(os.path.join(base, "iot_sensors.json")))

def _load_readings():
    base = os.path.join(os.path.dirname(__file__), "..", "..", "mock")
    return json.load(open(os.path.join(base, "sensor_readings.json")))

def _role_can_read_iot(role: str) -> bool:
    return role in {"facility_maintenance", "energy_management", "campus_security",
                    "it_administration", "campus_management"}

@router.get("/sensors")
def list_sensors(user: dict = Depends(get_current_user)):
    if not _role_can_read_iot(user.get("role", "")):
        raise HTTPException(403, "IoT access denied for this role")
    sensors = _load_sensors()
    # Security role only sees PIR + door sensors
    if user.get("role") == "campus_security":
        sensors = [s for s in sensors if s["type"] in ("pir", "door")]
    return {"sensors": sensors, "total": len(sensors),
            "online": sum(1 for s in sensors if s["status"] == "online"),
            "offline": sum(1 for s in sensors if s["status"] == "offline")}

@router.get("/sensors/{sensor_id}")
def sensor_detail(sensor_id: int, user: dict = Depends(get_current_user)):
    if not _role_can_read_iot(user.get("role", "")):
        raise HTTPException(403, "IoT access denied")
    sensors = _load_sensors()
    s = next((s for s in sensors if s["id"] == sensor_id), None)
    if not s:
        raise HTTPException(404, "Sensor not found")

    # Generate sparkline (last 60 minutes, 5-min buckets = 12 points)
    base_val = s.get("last_value", 50)
    sparkline = []
    now = datetime.utcnow()
    for i in range(12, 0, -1):
        sparkline.append({
            "ts": (now - timedelta(minutes=5 * i)).isoformat(),
            "value": round(base_val + random.uniform(-15, 15), 1),
        })
    return {**s, "sparkline": sparkline}

@router.get("/readings/{room_id}")
def room_readings(room_id: int, user: dict = Depends(get_current_user)):
    """Aggregated readings for a room — accessible to all authenticated roles (privacy-safe)."""
    readings = _load_readings()
    room_readings = [r for r in readings if r["room_id"] == room_id]
    return {"room_id": room_id, "readings": room_readings, "count": len(room_readings)}

@router.get("/alerts")
def alerts(user: dict = Depends(get_current_user)):
    if not _role_can_read_iot(user.get("role", "")):
        raise HTTPException(403, "IoT access denied")
    sensors = _load_sensors()
    alerts_list = []
    for s in sensors:
        if s["status"] == "offline":
            alerts_list.append({
                "sensor_id": s["id"], "type": "sensor_offline",
                "room": s["room_code"], "severity": "warning",
                "message": f"Sensor {s['device_uid']} offline > 5 min",
            })
        if s["type"] == "co2" and s.get("last_value", 0) > 1000:
            alerts_list.append({
                "sensor_id": s["id"], "type": "air_quality",
                "room": s["room_code"], "severity": "critical",
                "message": f"CO₂ {s['last_value']} ppm in {s['room_code']} — open windows",
            })
        if s["type"] == "temp" and (s.get("last_value", 0) > 30 or s.get("last_value", 0) < 18):
            alerts_list.append({
                "sensor_id": s["id"], "type": "comfort",
                "room": s["room_code"], "severity": "warning",
                "message": f"Temperature {s['last_value']}°C in {s['room_code']}",
            })
    return {"alerts": alerts_list, "count": len(alerts_list)}

class CommandRequest(BaseModel):
    room_code: str
    actuator_type: str   # hvac | lighting | projector
    payload: Dict[str, Any]

@router.post("/command")
def send_command(req: CommandRequest,
                 user: dict = Depends(require_roles("campus_management",
                                                    "it_administration",
                                                    "energy_management"))):
    """Publish a command to an actuator via MQTT. Stub for hackathon."""
    topic = f"pesitm/{req.room_code.split('-')[0]}/{req.room_code.split('-')[1]}/cmd/{req.actuator_type}"
    # In production: mqtt_client.publish(topic, json.dumps(req.payload))
    return {
        "ok": True,
        "published_topic": topic,
        "payload": req.payload,
        "issued_by": user.get("sub"),
        "ts": datetime.utcnow().isoformat(),
    }
