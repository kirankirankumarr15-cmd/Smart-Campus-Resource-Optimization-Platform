"""Digital Twin state endpoint."""
from fastapi import APIRouter, Depends
from routers.auth import get_current_user
import json, os
from config import config

router = APIRouter()

@router.get("/state")
def get_twin_state(user: dict = Depends(get_current_user)):
    """Returns the live digital twin state of all blocks/floors/rooms."""
    path = os.path.join(os.path.dirname(__file__), "..", "..", "mock", "campus_state.json")
    with open(path) as f:
        state = json.load(f)
    return {"campus": "PESITM", "state": state, "viewer_role": user.get("role")}
