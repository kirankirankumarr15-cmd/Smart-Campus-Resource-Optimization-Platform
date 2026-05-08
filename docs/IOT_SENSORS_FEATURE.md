# FEATURE 11 — IoT Sensors *(NEW)*

## Overview
A low-cost, privacy-respecting IoT sensor mesh that augments timetable + WiFi data with live environmental and occupancy signals. Sensors communicate via MQTT to the backend IoT Gateway. Sensors only emit aggregated counts and environmental values — no personal identifiers, no MAC addresses, no images.

## Hardware Reference (Bill of Materials)
| Sensor Type | Module | Per-room Cost | What It Measures |
|-------------|--------|---------------|------------------|
| PIR motion | HC-SR501 | ₹80 | Presence (binary) |
| CO₂ | MH-Z19B | ₹1200 | Occupancy proxy (ppm) |
| Temperature + Humidity | DHT22 | ₹250 | Comfort |
| Door reed switch | KY-021 | ₹40 | Entry events |
| Ambient light | BH1750 | ₹150 | Auto-dimming trigger |
| Smart plug | Sonoff S26 | ₹600 | Power-cut actuator |
| MCU | ESP32-WROOM | ₹350 | Edge controller |
| **Total / room (optional install)** | | **~₹2,670** | |

> Cost-optimized: PIR + CO₂ + ESP32 alone (~₹1,630/room) covers 80% of the value.

## MQTT Topic Design
```
pesitm/<block>/<room>/<sensor_type>             ← telemetry (sensor → backend)
pesitm/<block>/<room>/cmd/<actuator_type>       ← commands (backend → actuator)

Examples:
  pesitm/A/201/pir          → {"value": 1, "ts": "2026-04-29T09:35:12Z"}
  pesitm/A/201/co2          → {"value": 842, "unit": "ppm", "ts": "..."}
  pesitm/B/305/cmd/lighting → {"state": "off"}
  pesitm/B/305/cmd/hvac     → {"setpoint": 26, "mode": "cool"}
```

## Backend Service Responsibilities
1. **Subscribe** to `pesitm/+/+/+` topics on Mosquitto broker.
2. **Validate** payload (schema, range, freshness).
3. **Persist** to `sensor_readings` table (with sensor_id, room_id, value, ts).
4. **Push** real-time values to frontend via WebSocket channel `/ws/iot`.
5. **Detect alerts:**
   - CO₂ > 1000 ppm → "Air quality alert"
   - Temp > 30 °C or < 18 °C → "Comfort alert"
   - Sensor silent > 5 min → "Sensor offline"
6. **Publish commands** to actuator topics when AUTO actions execute (e.g., HVAC setpoint change).
7. **Expose health metrics** for the IoT Sensors UI page.

## API Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /iot/sensors` | List all sensors with status (online/offline/fault) |
| `GET /iot/sensors/{id}` | Sensor detail + sparkline data (last 60 min) |
| `GET /iot/readings/{room_id}` | Aggregated readings for a room (last 24 h) |
| `GET /iot/alerts` | Active alerts feed |
| `POST /iot/command` | Publish actuator command (Admin/IT only) |
| `WS /ws/iot` | Live telemetry stream |

## Role Access (IoT Sensors)
| Role | Access |
|------|--------|
| Student | None |
| Faculty | None |
| Academic Scheduling | None |
| Facility Maintenance | Read sensors + alerts (for diagnostics) |
| Energy Management | Read sensors + write HVAC/lighting commands |
| Campus Security | Read PIR + door alerts only |
| IT Administration | Full read/write + diagnostics + firmware metadata |
| Campus Management | Full read/write |

## UI Screen — IoT Sensor Network (Screen 9)
Layout: same shell as dashboard (sidebar + topbar + footer).
- **Top stat tiles (4):** Sensors Online · Sensors Offline · Avg Latency (ms) · Alerts Today
- **Mid-Left (60%):** Live sensor map — Leaflet map of campus with colored pins (green/amber/red).
- **Mid-Right drawer (40%):** Selected sensor detail — UID, type, room, last value, sparkline (last 60 min), Run Diagnostic button.
- **Bottom-Left (60%):** Live readings table (auto-refresh every 5 s).
- **Bottom-Right (40%):** Active Alerts feed with one-click "Create Action" button → pre-fills an Action card and routes through Safety Classifier.

## Privacy Guarantees
- No camera or microphone sensors used.
- PIR returns only boolean presence; aggregated to count via WiFi co-validation.
- CO₂ + temp values are environmental only.
- All readings indexed by room_id, never by user identity.
- Privacy badge in footer linked to public privacy policy.

## Demo Hook (added to demo step 5)
"Watch — when I click Optimize Campus Now, look at this live IoT panel. The HVAC actuator in Block B receives the MQTT command in real time, and the room's CO₂ reading begins to drop within seconds. That's a closed loop — sense, decide, actuate — without a human in the path for safe actions."
