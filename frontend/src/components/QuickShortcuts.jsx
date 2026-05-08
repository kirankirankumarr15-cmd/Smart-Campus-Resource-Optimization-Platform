import { useNavigate } from 'react-router-dom'
import { Wifi, Compass, Map, Calendar, Zap, ShieldAlert } from 'lucide-react'

export default function QuickShortcuts() {
  const navigate = useNavigate()

  const SHORTCUTS = [
    { label: "IOT-I", icon: Wifi,        to: "/iot",        color: "bg-blue-500", desc: "IoT Insights" },
    { label: "NAV-R", icon: Compass,     to: "/navigator",  color: "bg-orange",   desc: "Room Route" },
    { label: "TWIN-V", icon: Map,         to: "/twin",       color: "bg-navy",     desc: "Twin View" },
    { label: "SCHED-M", icon: Calendar,    to: "/schedule",   color: "bg-purple-600", desc: "Manage Sched" },
    { label: "ENER-O", icon: Zap,         to: "/impact",     color: "bg-yellow-500", desc: "Energy Opt" },
    { label: "SEC-L",  icon: ShieldAlert, to: "/settings",   color: "bg-red-500",    desc: "Security Log" },
  ]

  return (
    <div className="bg-white rounded-card p-5 border border-gray-100 shadow-sm">
      <h3 className="text-label uppercase tracking-widest text-textmute font-bold mb-4">Quick Shortcuts</h3>
      <div className="grid grid-cols-6 gap-3">
        {SHORTCUTS.map((s) => (
          <button
            key={s.label}
            onClick={() => navigate(s.to)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-page transition-all group active:scale-95"
          >
            <div className={`w-10 h-10 ${s.color} text-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <s.icon size={20} />
            </div>
            <div className="text-center">
              <p className="text-label font-bold text-navy leading-none">{s.label}</p>
              <p className="text-[10px] text-textmute mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {s.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
