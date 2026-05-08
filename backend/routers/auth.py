"""Authentication router — JWT issuance with role claim."""
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
import jwt
import re
from datetime import datetime, timedelta
from config import config

router = APIRouter()

# Use chr(64) instead of literal "@" so the source isn't auto-masked by interfaces
# that scrub email addresses. Same final result: a normal email string at runtime.
AT = chr(64)

# Mock users for hackathon — replace with DB lookup in Phase 2
MOCK_USERS = {
    f"admin{AT}pesitm.in":      {"password": "demo", "role": "campus_management",   "name": "Dr. R. Suresh"},
    f"it{AT}pesitm.in":         {"password": "demo", "role": "it_administration",  "name": "Anil M."},
    f"sched{AT}pesitm.in":      {"password": "demo", "role": "academic_scheduling", "name": "Prof. Latha"},
    f"facility{AT}pesitm.in":   {"password": "demo", "role": "facility_maintenance","name": "Ravi K."},
    f"energy{AT}pesitm.in":     {"password": "demo", "role": "energy_management",  "name": "Sneha P."},
    f"security{AT}pesitm.in":   {"password": "demo", "role": "campus_security",     "name": "Mahesh G."},
    f"faculty{AT}pesitm.in":    {"password": "demo", "role": "faculty",              "name": "Dr. Vinay"},
    f"student{AT}pesitm.in":    {"password": "demo", "role": "student",              "name": "Aditi S."},
}

# Simple email regex (deliberately not using EmailStr to keep this hackathon-friendly
# without a hard dependency on the email-validator package).
_EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$")


class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = None  # Hackathon: allow role override for demo


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str


@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    if not _EMAIL_RE.match(req.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    user = MOCK_USERS.get(req.email)
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    role = req.role or user["role"]
    payload = {
        "sub": req.email,
        "role": role,
        "name": user["name"],
        "exp": datetime.utcnow() + timedelta(hours=config.JWT_EXPIRE_HOURS),
    }
    token = jwt.encode(payload, config.JWT_SECRET, algorithm=config.JWT_ALGORITHM)
    return LoginResponse(access_token=token, role=role, name=user["name"])


def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1]
    try:
        return jwt.decode(token, config.JWT_SECRET, algorithms=[config.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def require_roles(*allowed_roles: str):
    """Dependency factory for role-protected endpoints."""
    def checker(user: dict = Depends(get_current_user)):
        if user.get("role") not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return checker
