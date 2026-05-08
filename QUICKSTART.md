# Quickstart — Campus Autopilot (PESITM)

## Option 1: Frontend-Only Demo (fastest, 30 seconds)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 → use any of the demo accounts:

| Email | Password | Role |
|-------|----------|------|
| [email protected] | demo | Campus Management (full access) |
| [email protected] | demo | IT Administration |
| [email protected] | demo | Academic Scheduling |
| [email protected] | demo | Facility Maintenance |
| [email protected] | demo | Energy Management |
| [email protected] | demo | Campus Security |
| [email protected] | demo | Faculty |
| [email protected] | demo | Student |

The frontend runs entirely on bundled mock data — no backend required.

## Option 2: Full Stack (backend + frontend)

```bash
# Terminal 1 — backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Backend: http://localhost:8000 · Docs: http://localhost:8000/docs
Frontend: http://localhost:5173

## Option 3: Docker Compose (production-like, includes Postgres + MQTT)

```bash
docker compose up
```

## Demo Flow (10 steps)

1. Log in as **Campus Management** to see the full dashboard.
2. Note the digital twin map: tiles colored by status.
3. Click **"Optimize Campus Now"** — watch the 7-step pipeline animate.
4. See auto-applied actions (green badges) + approval queue (amber badges).
5. Accept the "Move 9am Data Structures" action card.
6. Bottom impact bar updates: 128 kWh saved, 42 rooms optimized.
7. Click **Navigator** → search "40 students, Block B" → ranked rooms.
8. Click **Scenarios** → input "200 students, Block A" → split-screen twin.
9. Click **IoT Sensors** → click any row to see sparkline + diagnostic panel.
10. Log out and log in as **Student** — sidebar strips down, autopilot button gone.

## Project Layout

```
/campus-autopilot
├── README.md                  # full 8-section design doc
├── QUICKSTART.md              # this file
├── docker-compose.yml
├── /docs
│   └── IOT_SENSORS_FEATURE.md # detailed IoT feature spec
├── /frontend                  # React + Tailwind SPA
├── /backend                   # FastAPI + scikit-learn
└── /mock                      # 80 rooms, 30 IoT sensors, 3360 logs
```

## Roles & What They See

| Role | Autopilot | IoT Page | Maintenance | Impact | Actions |
|------|-----------|----------|-------------|--------|---------|
| Student              | ✗ | ✗ | ✗ | ✗ | Read-only schedule |
| Faculty              | ✗ | ✗ | ✗ | ✗ | Assigned rooms only |
| Academic Scheduling  | ✗ | ✗ | ✗ | ✗ | Schedule changes |
| Facility Maintenance | ✗ | ✓ Read | ✓ | ✗ | Maintenance only |
| Energy Management    | ✗ | ✓ R/W | ✗ | ✓ | Energy actions |
| Campus Security      | ✗ | ✓ Limited | ✗ | ✗ | Security only |
| IT Administration    | ✓ | ✓ Full | ✓ | ✓ | All |
| Campus Management    | ✓ | ✓ Full | ✓ | ✓ | All |
