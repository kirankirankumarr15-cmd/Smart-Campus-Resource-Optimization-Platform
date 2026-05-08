// Mock data for hackathon demo — works without backend running
// Generated to match /mock/*.json from the backend

const STATUSES = ["free", "moderate", "crowded", "active", "idle"]
const BLOCKS = ["A", "B", "C"]
const DEPTS = { A: "CSE", B: "ECE", C: "MECH" }

function mkRooms() {
  const rooms = []
  let id = 1
  for (const block of BLOCKS) {
    for (let floor = 0; floor < 3; floor++) {
      for (let n = 1; n <= 9 && id <= 80; n++) {
        const cap = [30, 40, 60, 75, 90][Math.floor(Math.random() * 5)]
        const status = STATUSES[Math.floor(Math.random() * STATUSES.length)]
        let occ = 0
        if (status === "free") occ = Math.floor(Math.random() * cap * 0.1)
        else if (status === "moderate") occ = Math.floor(cap * (0.4 + Math.random() * 0.3))
        else if (status === "crowded") occ = Math.floor(cap * (0.85 + Math.random() * 0.15))
        else if (status === "active") occ = Math.floor(cap * (0.2 + Math.random() * 0.3))
        rooms.push({
          id: id++,
          code: `${block}-${floor}${String(n).padStart(2, "0")}`,
          block, floor, capacity: cap, status,
          current_occupancy: occ,
          type: ["classroom", "classroom", "lab", "seminar"][Math.floor(Math.random() * 4)],
          department: DEPTS[block],
        })
      }
    }
  }
  return rooms
}

export const mockRooms = mkRooms()

export const mockActions = [
  {
    id: 1, room_id: 5, action_type: "lighting",
    title: "Turn off lights in A-205",
    reason: "Predicted vacant for next 60 min (P=0.04)",
    impact_metric: "kWh saved", impact_value: 16.0,
    confidence: 0.92, safety_tag: "AUTO", status: "applied",
    params: { state: "off" }, affected_occupants: 0,
  },
  {
    id: 2, room_id: 12, action_type: "hvac_minor",
    title: "Raise HVAC setpoint to 26°C in B-203",
    reason: "Low predicted occupancy (0.28) for next hour",
    impact_metric: "kWh saved", impact_value: 32.0,
    confidence: 0.88, safety_tag: "AUTO", status: "applied",
    params: { setpoint: 26 }, affected_occupants: 17,
  },
  {
    id: 3, room_id: 8, action_type: "schedule_change",
    title: "Move 9am Data Structures from A-201 to Seminar Hall 1",
    reason: "Room near capacity (P=0.96) — comfort risk",
    impact_metric: "students relieved", impact_value: 14,
    confidence: 0.78, safety_tag: "APPROVAL", status: "pending",
    params: { alt_room_hint: "seminar-hall-1" }, affected_occupants: 14,
  },
  {
    id: 4, room_id: 19, action_type: "lighting",
    title: "Turn off lights in C-104",
    reason: "Predicted vacant for next 60 min (P=0.06)",
    impact_metric: "kWh saved", impact_value: 12.0,
    confidence: 0.91, safety_tag: "AUTO", status: "applied",
    params: { state: "off" }, affected_occupants: 0,
  },
  {
    id: 5, room_id: 22, action_type: "hvac_major",
    title: "Cycle HVAC compressor in B-302 (60-min downtime)",
    reason: "Energy spike pattern detected — preventative cycle",
    impact_metric: "kWh saved", impact_value: 48.0,
    confidence: 0.72, safety_tag: "APPROVAL", status: "pending",
    params: { duration_min: 60 }, affected_occupants: 22,
  },
  {
    id: 6, room_id: 30, action_type: "room_lock",
    title: "Lock C-304 outside scheduled hours",
    reason: "After-hours access detected 4 nights this week",
    impact_metric: "security score", impact_value: 8,
    confidence: 0.81, safety_tag: "APPROVAL", status: "pending",
    params: { lock_after: "20:00" }, affected_occupants: 0,
  },
]

export const mockSensors = Array.from({ length: 30 }, (_, i) => {
  const types = ["pir", "co2", "temp", "door", "light", "power"]
  const t = types[i % types.length]
  const r = mockRooms[i * 2 % mockRooms.length]
  const isOnline = Math.random() > 0.1
  const ranges = { pir: [0, 1], co2: [400, 1300], temp: [18, 32],
                   door: [0, 1], light: [50, 800], power: [10, 350] }
  const units = { pir: "count", co2: "ppm", temp: "°C",
                  door: "state", light: "lux", power: "W" }
  const [lo, hi] = ranges[t]
  const value = +(lo + Math.random() * (hi - lo)).toFixed(1)
  return {
    id: i + 1,
    device_uid: `PSTM-${t.toUpperCase()}-${String(1000 + i).padStart(4, "0")}`,
    room_id: r.id, room_code: r.code, type: t,
    mqtt_topic: `pesitm/${r.block}/${r.code.split('-')[1]}/${t}`,
    status: isOnline ? "online" : "offline",
    last_value: value, unit: units[t],
    last_seen: isOnline ? new Date().toISOString() :
                          new Date(Date.now() - 12 * 60_000).toISOString(),
    firmware_version: "v1.2.3",
    sparkline: Array.from({ length: 12 }, (_, j) => ({
      ts: new Date(Date.now() - (12 - j) * 5 * 60_000).toISOString(),
      value: +(lo + Math.random() * (hi - lo)).toFixed(1),
    })),
  }
})

export const mockAlerts = mockSensors
  .filter(s => s.status === "offline" ||
               (s.type === "co2" && s.last_value > 1000) ||
               (s.type === "temp" && (s.last_value > 30 || s.last_value < 18)))
  .map(s => ({
    sensor_id: s.id,
    type: s.status === "offline" ? "sensor_offline" :
          s.type === "co2" ? "air_quality" : "comfort",
    room: s.room_code,
    severity: s.status === "offline" ? "warning" :
              s.type === "co2" ? "critical" : "warning",
    message: s.status === "offline" ? `Sensor ${s.device_uid} offline > 5 min` :
             s.type === "co2" ? `CO₂ ${s.last_value} ppm in ${s.room_code} — open windows` :
             `Temperature ${s.last_value}°C in ${s.room_code}`,
  }))

export const mockHistoryRuns = Array.from({ length: 10 }, (_, i) => {
  const before = 180 + Math.floor(Math.random() * 60)
  const after = before - 60 - Math.floor(Math.random() * 70)
  return {
    label: `Run ${i + 1}`,
    before_kwh: before,
    after_kwh: after,
  }
})
