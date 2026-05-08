"""
Safety Classifier — explicit rules only, no black-box AI.
AUTO     → confidence > 0.85 AND action_type IN {lighting, hvac_minor}
APPROVAL → action_type IN {schedule_change, room_lock, hvac_major}
REJECT   → affects > 50 occupants OR irreversible within 60 min
"""
from typing import Any

AUTO_TYPES     = {"lighting", "hvac_minor"}
APPROVAL_TYPES = {"schedule_change", "room_lock", "hvac_major"}
IRREVERSIBLE   = {"room_lock"}


def classify(action: Any) -> str:
    affected = getattr(action, "affected_occupants", 0)
    a_type = getattr(action, "action_type", "")
    confidence = getattr(action, "confidence", 0.0)

    if affected > 50:
        return "REJECT"
    if a_type in IRREVERSIBLE and confidence < 0.6:
        return "REJECT"
    if a_type in APPROVAL_TYPES:
        return "APPROVAL"
    if confidence > 0.85 and a_type in AUTO_TYPES:
        return "AUTO"
    return "APPROVAL"
