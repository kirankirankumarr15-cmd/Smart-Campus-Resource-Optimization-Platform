"""
Optimization Engine
Maximize(utilization + comfort) − minimize(energy + crowding)
under department fairness constraints.
"""
from typing import List, Dict
from dataclasses import dataclass, asdict


@dataclass
class Action:
    room_id: int
    action_type: str
    title: str
    reason: str
    impact_metric: str
    impact_value: float
    confidence: float
    score: float
    affected_occupants: int
    params: dict


def optimize(
    predictions: Dict[int, Dict[int, float]],
    rooms: List[dict],
    dept_weights: Dict[str, float],
    last_run_dept_actions: Dict[str, int],
) -> List[Action]:
    actions: List[Action] = []

    for room in rooms:
        rid = room["id"]
        dept = room.get("department", "UNKNOWN")
        prob_60 = predictions.get(rid, {}).get(60, 0.0)
        prob_0  = predictions.get(rid, {}).get(0, 0.0)
        cap = room["capacity"]

        # Lights off when expected vacancy
        if prob_60 < 0.10 and room["status"] in ("idle", "free"):
            energy_save = 0.4 * cap
            score = _score(0.0, 0.0, -energy_save, 0.0, dept_weights.get(dept, 1.0))
            actions.append(Action(
                room_id=rid, action_type="lighting",
                title=f"Turn off lights in {room['code']}",
                reason=f"Predicted vacant for next 60 min (P={prob_60:.2f})",
                impact_metric="kWh saved", impact_value=round(energy_save, 1),
                confidence=0.92, score=score, affected_occupants=0,
                params={"state": "off"}))

        # HVAC setpoint relax for low occupancy
        if 0.10 <= prob_60 < 0.40:
            energy_save = 0.8 * cap
            score = _score(0.0, -0.05, -energy_save, 0.0, dept_weights.get(dept, 1.0))
            actions.append(Action(
                room_id=rid, action_type="hvac_minor",
                title=f"Raise HVAC setpoint to 26°C in {room['code']}",
                reason=f"Low predicted occupancy ({prob_60:.2f}) for next hour",
                impact_metric="kWh saved", impact_value=round(energy_save, 1),
                confidence=0.88, score=score,
                affected_occupants=int(prob_60 * cap),
                params={"setpoint": 26}))

        # Suggest reassignment for crowded rooms
        if prob_0 > 0.95:
            score = _score(0.3, 0.4, 0.0, -0.5, dept_weights.get(dept, 1.0))
            actions.append(Action(
                room_id=rid, action_type="schedule_change",
                title=f"Move next session from {room['code']} to a larger hall",
                reason=f"Room near capacity (P={prob_0:.2f}) — comfort risk",
                impact_metric="students relieved", impact_value=int(0.2 * cap),
                confidence=0.78, score=score, affected_occupants=cap,
                params={"alt_room_hint": "seminar-hall-1"}))

    # Fairness filter: drop deprioritized departments
    actions = [a for a in actions
               if last_run_dept_actions.get(_dept_of(a.room_id, rooms), 0) < 2]
    actions.sort(key=lambda a: a.score, reverse=True)
    return actions


def _score(util_gain, comfort_gain, energy_cost, crowd_penalty, dept_weight):
    numerator = util_gain + comfort_gain + abs(energy_cost)
    denominator = abs(energy_cost) + abs(crowd_penalty) + 0.1
    return round(dept_weight * numerator / denominator, 3)


def _dept_of(room_id, rooms):
    for r in rooms:
        if r["id"] == room_id:
            return r.get("department", "UNKNOWN")
    return "UNKNOWN"
