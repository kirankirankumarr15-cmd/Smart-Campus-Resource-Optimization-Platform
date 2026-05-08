"""Actions router — list + Accept/Edit/Reject responses."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from routers.auth import get_current_user

router = APIRouter()

# In-memory store for demo (replace with DB)
_pending_actions: list = []
_feedback_log: list = []

class ActionResponse(BaseModel):
    response: str  # "accept" | "edit" | "reject"
    edited_params: Optional[Dict[str, Any]] = None

@router.get("/")
def list_actions(user: dict = Depends(get_current_user)):
    """Return actions filtered by role scope."""
    role = user.get("role")
    role_filter = {
        "student":              [],
        "faculty":              ["schedule_change"],
        "academic_scheduling":  ["schedule_change", "room_lock"],
        "facility_maintenance": ["lighting", "hvac_minor", "hvac_major"],
        "energy_management":    ["lighting", "hvac_minor", "hvac_major"],
        "campus_security":      ["room_lock"],
        "it_administration":    None,    # All
        "campus_management":    None,    # All
    }
    allowed = role_filter.get(role, [])
    if allowed is None:
        return _pending_actions
    return [a for a in _pending_actions if a.get("action_type") in allowed]


@router.post("/{action_id}/respond")
def respond_to_action(action_id: int, body: ActionResponse,
                     user: dict = Depends(get_current_user)):
    if user.get("role") not in {"campus_management", "it_administration",
                                "academic_scheduling", "energy_management"}:
        raise HTTPException(403, "Cannot respond to actions in this role")

    action = next((a for a in _pending_actions if a["id"] == action_id), None)
    if not action:
        raise HTTPException(404, "Action not found")

    _feedback_log.append({
        "action_id": action_id,
        "action_type": action["action_type"],
        "user_email": user.get("sub"),
        "response": body.response,
        "recommended_params": action.get("params", {}),
        "edited_params": body.edited_params or {},
    })
    if body.response in ("accept", "edit"):
        action["status"] = "applied"
    else:
        action["status"] = "rejected"
    return {"ok": True, "action_id": action_id, "new_status": action["status"]}
