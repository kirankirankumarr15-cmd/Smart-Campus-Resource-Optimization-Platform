import { useCampus } from '../context/CampusStateContext.jsx'
import { Zap, Building, Users, Leaf, Clock } from 'lucide-react'

const Item = ({ icon: Icon, label, value, highlight }) => (
  <div className="flex items-center gap-2 px-4">
    <Icon size={16} className={highlight ? "text-orange" : "text-textmute"} />
    <div>
      <p className="text-label text-textmute uppercase tracking-wider leading-none">{label}</p>
      <p className={`text-body font-medium leading-tight ${highlight ? "text-orange" : "text-navy"}`}>
        {value}
      </p>
    </div>
  </div>
)

export default function ImpactBar() {
  const { state } = useCampus()
  const m = state.impact
  return (
    <div className="h-[56px] bg-white border-t border-gray-200 flex items-center justify-around px-2">
      <Item icon={Zap}      label="Energy Saved"        value={`${m.energy_saved_kwh} kWh`} highlight />
      <Item icon={Building} label="Rooms Optimized"     value={m.rooms_optimized} />
      <Item icon={Users}    label="Crowd Score"         value={`${m.crowd_score}/100`} />
      <Item icon={Leaf}     label="Sustainability"      value={`${m.sustainability_index}/100`} />
      <Item icon={Clock}    label="Pending Approvals"   value={m.pending_approvals} />
    </div>
  )
}
