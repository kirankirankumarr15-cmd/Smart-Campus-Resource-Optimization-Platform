"""
Prediction Engine
Combines timetable prior + recent access-log signal + IoT real-time correction.
"""
from datetime import datetime, timedelta, time
from collections import defaultdict
from typing import Dict, List


def predict_occupancy(
    timetable_slots: List[dict],
    access_logs: List[dict],
    sensor_readings: List[dict],
    rooms: List[dict],
    now: datetime,
) -> Dict[int, Dict[int, float]]:
    """Returns {room_id: {horizon_min: probability}} for horizons 0,15,30,45,60."""
    horizons = [0, 15, 30, 45, 60]
    result: Dict[int, Dict[int, float]] = {}

    timetable_prior: Dict[int, Dict[int, float]] = defaultdict(lambda: defaultdict(float))
    for slot in timetable_slots:
        st = _parse_time(slot["start_time"])
        et = _parse_time(slot["end_time"])
        for h in horizons:
            future_t = (now + timedelta(minutes=h)).time()
            if st <= future_t <= et:
                cap = _capacity_of(slot["room_id"], rooms)
                timetable_prior[slot["room_id"]][h] = min(slot["expected_count"] / max(cap, 1), 1.0)

    log_signal: Dict[int, Dict[int, float]] = defaultdict(lambda: defaultdict(float))
    for log in access_logs:
        log_ts = log["ts"] if isinstance(log["ts"], datetime) else \
                 datetime.fromisoformat(str(log["ts"]).replace("Z", "+00:00"))
        # Normalize to a comparable form (strip tzinfo if both sides aren't aware)
        if log_ts.tzinfo is not None and now.tzinfo is None:
            log_ts = log_ts.replace(tzinfo=None)
        elif log_ts.tzinfo is None and now.tzinfo is not None:
            now_local = now.replace(tzinfo=None)
        else:
            now_local = now
        try:
            age_min = max((now - log_ts).total_seconds() / 60, 0)
        except TypeError:
            # Last-resort: drop tz from both sides
            ln = log_ts.replace(tzinfo=None) if log_ts.tzinfo else log_ts
            nn = now.replace(tzinfo=None) if now.tzinfo else now
            age_min = max((nn - ln).total_seconds() / 60, 0)
        weight = 2.0 if age_min <= 30 else 1.0
        room_cap = _capacity_of(log["room_id"], rooms)
        ratio = log["connected_count"] / max(room_cap, 1)
        for h in horizons:
            decay = max(0.0, 1 - (h / 90))
            log_signal[log["room_id"]][h] += weight * ratio * decay

    for rid in log_signal:
        max_val = max(log_signal[rid].values()) or 1
        for h in horizons:
            log_signal[rid][h] = min(log_signal[rid][h] / max_val, 1.0)

    iot_signal: Dict[int, float] = defaultdict(float)
    for r in sensor_readings:
        if r.get("type") == "pir" and r.get("value", 0) > 0:
            iot_signal[r["room_id"]] = max(iot_signal[r["room_id"]], 0.6)
        if r.get("type") == "co2" and r.get("value", 0) > 800:
            iot_signal[r["room_id"]] = max(iot_signal[r["room_id"]], 0.85)

    for room in rooms:
        rid = room["id"]
        result[rid] = {}
        for h in horizons:
            tt = timetable_prior[rid].get(h, 0.0)
            lg = log_signal[rid].get(h, 0.0)
            iot = iot_signal[rid] if h <= 15 else 0.0
            p = 0.5 * tt + 0.3 * lg + 0.2 * iot
            result[rid][h] = round(min(max(p, 0.0), 1.0), 3)
    return result


def _parse_time(t):
    if isinstance(t, time):
        return t
    h, m = str(t).split(":")[:2]
    return time(int(h), int(m))


def _capacity_of(room_id: int, rooms: list) -> int:
    for r in rooms:
        if r["id"] == room_id:
            return r["capacity"]
    return 1
