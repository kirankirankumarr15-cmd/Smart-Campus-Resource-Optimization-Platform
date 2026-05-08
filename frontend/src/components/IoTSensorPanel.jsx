import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { Wifi, WifiOff, Activity, AlertTriangle } from 'lucide-react'

export default function IoTSensorPanel({ sensor, onClose }) {
  if (!sensor) return null
  const isOnline = sensor.status === "online"

  return (
    <div className="bg-white rounded-card p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi className="text-green" size={18} /> : <WifiOff className="text-red-500" size={18} />}
          <h3 className="text-nav font-medium text-navy">{sensor.device_uid}</h3>
        </div>
        <button onClick={onClose} className="text-textmute hover:text-navy text-body">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Stat label="Type"      value={sensor.type.toUpperCase()} />
        <Stat label="Room"      value={sensor.room_code} />
        <Stat label="Last Value" value={`${sensor.last_value} ${sensor.unit}`} />
        <Stat label="Status"    value={sensor.status} highlight={isOnline} />
        <Stat label="Firmware"  value={sensor.firmware_version} />
        <Stat label="Last Seen" value={sensor.last_seen ? new Date(sensor.last_seen).toLocaleTimeString() : "—"} />
      </div>

      {/* Sparkline */}
      {sensor.sparkline && (
        <div>
          <p className="text-label uppercase tracking-wider text-textmute mb-2">Last 60 Minutes</p>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensor.sparkline}>
                <Line type="monotone" dataKey="value" stroke="#e85d26" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <button className="mt-4 w-full h-10 bg-navy text-white text-body font-medium rounded-pill flex items-center justify-center gap-2">
        <Activity size={14} /> Run Diagnostic
      </button>
    </div>
  )
}

const Stat = ({ label, value, highlight }) => (
  <div className="bg-page rounded-lg px-3 py-2">
    <p className="text-label uppercase tracking-wider text-textmute">{label}</p>
    <p className={`text-body font-medium ${highlight ? "text-green-700" : "text-navy"}`}>{value}</p>
  </div>
)
