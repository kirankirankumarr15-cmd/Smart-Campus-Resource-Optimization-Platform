import { useState } from 'react'
import ActionCard from '../components/ActionCard.jsx'
import { mockActions } from '../mockData.js'
import { useAuth } from '../context/AuthContext.jsx'

const FILTERS = [
  { value: "all",    label: "All" },
  { value: "lighting", label: "Energy" },
  { value: "schedule_change", label: "Schedule" },
  { value: "maintenance", label: "Maintenance" },
  { value: "iot", label: "IoT" },
]

export default function Actions() {
  const [filter, setFilter] = useState("all")
  const [actions, setActions] = useState(mockActions)
  const { can } = useAuth()

  let visible = actions
  if (!can("approve_actions"))
    visible = visible.filter(a => ["lighting", "hvac_minor"].includes(a.action_type))
  if (filter !== "all") {
    visible = visible.filter(a =>
      filter === "iot" ? a.action_type.includes("hvac") : a.action_type.includes(filter)
    )
  }

  const handleAccept = (action, edited) => {
    setActions(prev => prev.map(a =>
      a.id === action.id ? { ...a, status: "applied", params: edited || a.params } : a))
  }
  const handleReject = (action) => {
    setActions(prev => prev.map(a =>
      a.id === action.id ? { ...a, status: "rejected" } : a))
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-hero font-medium text-navy">Action Cards · Role-Filtered</h2>
        <p className="text-body text-textmute mt-1">
          Showing {visible.length} of {actions.length} actions for your role.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 h-9 rounded-pill text-body transition-colors
              ${filter === f.value ? "bg-navy text-white" : "bg-white border border-gray-200 text-textmute hover:text-navy"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {visible.map(a => (
          <ActionCard key={a.id} action={a}
                      onAccept={handleAccept} onReject={handleReject} />
        ))}
      </div>
    </div>
  )
}
