import { useState } from 'react'
import { mockSensors, mockAlerts } from '../mockData.js'
import IoTSensorPanel from '../components/IoTSensorPanel.jsx'
import { Wifi, WifiOff, AlertTriangle, Activity, Plus } from 'lucide-react'

const Stat = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-card p-4 border border-gray-100 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center
      ${accent === "green"  ? "bg-green/20 text-green-700" :
        accent === "red"    ? "bg-red-100 text-red-600" :
        accent === "orange" ? "bg-orange/10 text-orange" :
        "bg-page text-textmute"}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-label uppercase tracking-wider text-textmute">{label}</p>
      <p className="text-stat font-medium text-navy leading-none mt-1">{value}</p>
    </div>
  </div>
)

export default function IoTSensors() {
  const [selected, setSelected] = useState(null)

  const online = mockSensors.filter(s => s.status === "online").length
  const offline = mockSensors.length - online
  const avgLatency = 42

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-hero font-medium text-navy">IoT Sensor Network</h2>
        <p className="text-body text-textmute mt-1">
          Live mesh of PIR · CO₂ · Temperature · Door · Light · Power sensors across PESITM.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Stat icon={Wifi}           label="Sensors Online"  value={online} accent="green" />
        <Stat icon={WifiOff}        label="Sensors Offline" value={offline} accent="red" />
        <Stat icon={Activity}       label="Avg Latency"     value={`${avgLatency} ms`} />
        <Stat icon={AlertTriangle}  label="Alerts Today"    value={mockAlerts.length} accent="orange" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Sensor list */}
        <div className="col-span-2 bg-white rounded-card p-5 border border-gray-100">
          <h3 className="text-nav font-medium text-navy mb-3">Sensors</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-body">
              <thead>
                <tr className="text-textmute text-label uppercase tracking-wider border-b border-gray-100">
                  <th className="text-left py-2">Sensor UID</th>
                  <th className="text-left py-2">Room</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-right py-2">Value</th>
                  <th className="text-right py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockSensors.map(s => (
                  <tr
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className={`border-b border-gray-50 hover:bg-page cursor-pointer
                      ${selected?.id === s.id ? "bg-page" : ""}`}
                  >
                    <td className="py-2 font-mono text-label">{s.device_uid}</td>
                    <td className="py-2">{s.room_code}</td>
                    <td className="py-2 uppercase text-label tracking-wider text-textmute">{s.type}</td>
                    <td className="py-2 text-right font-medium">{s.last_value} {s.unit}</td>
                    <td className="py-2 text-right">
                      <span className={`px-2 py-0.5 rounded text-label uppercase tracking-wider
                        ${s.status === "online" ? "bg-green/20 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side: Sensor detail OR alerts feed */}
        <div className="space-y-4">
          {selected ? (
            <IoTSensorPanel sensor={selected} onClose={() => setSelected(null)} />
          ) : (
            <div className="bg-white rounded-card p-5 border border-gray-100">
              <h3 className="text-nav font-medium text-navy mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-orange" /> Active Alerts
              </h3>
              <div className="space-y-2">
                {mockAlerts.length === 0 ? (
                  <p className="text-body text-textmute">No alerts. All systems nominal.</p>
                ) : mockAlerts.slice(0, 6).map((a, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-page">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0
                      ${a.severity === "critical" ? "bg-red-500" : "bg-amber-500"}`} />
                    <div className="flex-1">
                      <p className="text-body text-navy leading-snug">{a.message}</p>
                      <p className="text-label text-textmute uppercase tracking-wider mt-0.5">
                        {a.type.replace("_", " ")} · {a.room}
                      </p>
                    </div>
                    <button className="text-label uppercase tracking-wider text-orange hover:underline flex items-center gap-1">
                      <Plus size={12} /> Action
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MQTT topic info */}
      <div className="bg-navy rounded-card p-5 text-white/90">
        <h3 className="text-nav font-medium text-white mb-2">MQTT Architecture</h3>
        <div className="grid grid-cols-2 gap-4 text-body">
          <div>
            <p className="text-label uppercase tracking-wider text-white/50">Telemetry Topic</p>
            <p className="font-mono mt-1">pesitm/&lt;block&gt;/&lt;room&gt;/&lt;sensor_type&gt;</p>
          </div>
          <div>
            <p className="text-label uppercase tracking-wider text-white/50">Command Topic</p>
            <p className="font-mono mt-1">pesitm/&lt;block&gt;/&lt;room&gt;/cmd/&lt;actuator&gt;</p>
          </div>
        </div>
      </div>
    </div>
  )
}
