import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  LayoutDashboard, Map, ListChecks, Compass, Beaker,
  Wrench, TrendingUp, Wifi, Settings as SettingsIcon, LogOut, CalendarDays,
} from 'lucide-react'

const ALL_ITEMS = [
  { to: "/",            label: "Dashboard",    icon: LayoutDashboard, cap: null },
  { to: "/twin",        label: "Twin Map",     icon: Map,             cap: null },
  { to: "/actions",     label: "Actions",      icon: ListChecks,      cap: null },
  { to: "/navigator",   label: "Navigator",    icon: Compass,         cap: null },
  { to: "/scenarios",   label: "Scenarios",    icon: Beaker,          cap: "approve_actions" },
  { to: "/maintenance", label: "Maintenance",  icon: Wrench,          cap: "view_maintenance" },
  { to: "/schedule",    label: "Schedule",     icon: CalendarDays,    cap: null },
  { to: "/impact",      label: "Impact",       icon: TrendingUp,      cap: "view_impact" },
  { to: "/iot",         label: "IoT Sensors",  icon: Wifi,            cap: "view_iot" },
  { to: "/settings",    label: "Settings",     icon: SettingsIcon,    cap: null },
]

export default function Sidebar() {
  const { can, logout, user } = useAuth()
  const items = ALL_ITEMS.filter((i) => !i.cap || can(i.cap))

  return (
    <aside className="w-[220px] bg-navy text-white flex flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <p className="text-label uppercase tracking-wider text-white/50">Logged in as</p>
        <p className="text-nav mt-0.5 truncate">{user?.name || "Guest"}</p>
        <span className="inline-block mt-2 px-2 py-0.5 rounded bg-orange/20 text-orange text-label">
          {user?.role?.replace(/_/g, " ")}
        </span>
      </div>

      <nav className="flex-1 py-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-nav transition-colors relative
                 ${isActive
                   ? "bg-white/5 text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-orange"
                   : "text-white/70 hover:bg-white/5 hover:text-white"}`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-5 py-3 text-nav text-white/60 hover:text-white border-t border-white/10"
      >
        <LogOut size={18} />
        <span>Log out</span>
      </button>
    </aside>
  )
}
