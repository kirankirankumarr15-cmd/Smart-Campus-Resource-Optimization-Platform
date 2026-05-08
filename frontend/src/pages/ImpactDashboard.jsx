import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
         RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'
import { mockHistoryRuns } from '../mockData.js'
import { Zap, Building, Users, Leaf, Clock } from 'lucide-react'

const fairness = [
  { axis: "Utilization", value: 85 },
  { axis: "Comfort",     value: 78 },
  { axis: "Energy",      value: 92 },
  { axis: "Crowd",       value: 70 },
  { axis: "Fairness",    value: 88 },
]

const Tile = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-card p-4 border border-gray-100 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center
      ${accent === "orange" ? "bg-orange/10 text-orange" :
        accent === "green"  ? "bg-green/20 text-green-700" :
        "bg-page text-textmute"}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-label uppercase tracking-wider text-textmute">{label}</p>
      <p className="text-stat font-medium text-navy leading-none mt-1">{value}</p>
    </div>
  </div>
)

export default function ImpactDashboard() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-hero font-medium text-navy">Impact Dashboard</h2>
        <p className="text-body text-textmute mt-1">Last 10 optimization runs · Fairness radar.</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        <Tile icon={Zap}      label="Energy Saved"   value="1,284 kWh" accent="orange" />
        <Tile icon={Building} label="Rooms Optimized" value="412" />
        <Tile icon={Users}    label="Crowd Score"    value="78/100" accent="green" />
        <Tile icon={Leaf}     label="Sustainability" value="84/100" />
        <Tile icon={Clock}    label="Pending"        value="3" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-card p-5 border border-gray-100">
          <h3 className="text-nav font-medium text-navy mb-3">Last 10 Runs · Energy (kWh)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHistoryRuns}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="label" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="before_kwh" stroke="#888" strokeWidth={2}
                      dot={{ r: 3 }} name="Before Optimization" />
                <Line type="monotone" dataKey="after_kwh" stroke="#e85d26" strokeWidth={2.5}
                      dot={{ r: 3 }} name="After Optimization" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-card p-5 border border-gray-100">
          <h3 className="text-nav font-medium text-navy mb-3">Fairness Radar</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={fairness}>
                <PolarGrid stroke="#eee" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#888", fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: "#888", fontSize: 10 }} />
                <Radar dataKey="value" stroke="#e85d26" fill="#e85d26" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
