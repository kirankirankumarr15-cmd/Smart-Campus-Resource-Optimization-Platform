"""Pydantic schemas for request/response models."""
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime


class RoomOut(BaseModel):
    id: int
    code: str
    block: str
    floor: int
    capacity: int
    type: str
    department: str
    status: str
    current_occupancy: int


class ActionOut(BaseModel):
    id: int
    room_id: int
    action_type: str
    title: str
    reason: str
    impact_metric: str
    impact_value: float
    confidence: float
    safety_tag: str
    status: str
    params: Dict[str, Any]


class SensorOut(BaseModel):
    id: int
    device_uid: str
    room_id: int
    room_code: str
    type: str
    status: str
    last_seen: Optional[datetime]
    last_value: Optional[float]
    firmware_version: Optional[str]


class ImpactMetrics(BaseModel):
    energy_saved_kwh: float
    rooms_optimized: int
    crowd_score: int
    sustainability_index: int
    pending_approvals: int
    sensors_online: int
    sensors_total: int
