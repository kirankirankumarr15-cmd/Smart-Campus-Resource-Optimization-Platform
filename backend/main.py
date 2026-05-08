"""
Campus Autopilot — FastAPI Backend
PESITM (PESIT South Campus, Tumkur)
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, twin, autopilot, actions, navigation, simulation, maintenance, impact, iot

app = FastAPI(
    title="Campus Autopilot API",
    description="Smart Campus Resource Optimization Platform — PESITM",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth.router,        prefix="/auth",        tags=["auth"])
app.include_router(twin.router,        prefix="/twin",        tags=["twin"])
app.include_router(autopilot.router,   prefix="/autopilot",   tags=["autopilot"])
app.include_router(actions.router,     prefix="/actions",     tags=["actions"])
app.include_router(navigation.router,  prefix="/rooms",       tags=["navigation"])
app.include_router(simulation.router,  prefix="/simulate",    tags=["simulation"])
app.include_router(maintenance.router, prefix="/maintenance", tags=["maintenance"])
app.include_router(impact.router,      prefix="/impact",      tags=["impact"])
app.include_router(iot.router,         prefix="/iot",         tags=["iot"])

@app.get("/")
def root():
    return {
        "service": "Campus Autopilot",
        "campus": "PESITM (PESIT South Campus, Tumkur)",
        "status": "ok",
        "docs": "/docs",
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
