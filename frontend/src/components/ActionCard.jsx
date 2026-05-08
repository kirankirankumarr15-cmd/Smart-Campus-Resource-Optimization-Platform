import { useState } from 'react'
import { Check, X, Edit3, Zap, Calendar, Lock, Wrench, Wifi } from 'lucide-react'

const TYPE_ICON = {
  lighting:        Zap,
  hvac_minor:      Zap,
  hvac_major:      Zap,
  schedule_change: Calendar,
  room_lock:       Lock,
  maintenance:     Wrench,
  iot_command:     Wifi,
}

export default function ActionCard({ action, onAccept, onEdit, onReject }) {
  const [editing, setEditing] = useState(false)
  const [params, setParams] = useState(action.params || {})

  const Icon = TYPE_ICON[action.action_type] || Zap
  const isAuto = action.safety_tag === "AUTO"

  return (
    <div className="bg-white rounded-card p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-page flex items-center justify-center">
            <Icon size={16} className="text-navy" />
          </div>
          <span className="text-label uppercase tracking-wider text-textmute">
            {action.action_type.replace(/_/g, " ")}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded text-label font-medium uppercase tracking-wider
          ${isAuto ? "bg-green/20 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {action.safety_tag}
        </span>
      </div>

      <h4 className="text-nav font-medium text-navy mb-1">{action.title}</h4>
      <p className="text-body text-textmute mb-2 leading-snug">{action.reason}</p>

      <div className="flex items-center justify-between mb-3">
        <span className="text-body text-green-700 font-medium">
          ↑ {action.impact_value} {action.impact_metric}
        </span>
        <span className="text-label text-textmute">
          Confidence: {(action.confidence * 100).toFixed(0)}%
        </span>
      </div>

      {editing && (
        <div className="bg-page rounded-lg p-3 mb-3 space-y-2">
          {Object.entries(params).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              <label className="text-label uppercase tracking-wider text-textmute w-20">{k}</label>
              <input
                value={v}
                onChange={(e) => setParams({ ...params, [k]: e.target.value })}
                className="flex-1 px-2 py-1 border border-gray-200 rounded text-body"
              />
            </div>
          ))}
        </div>
      )}

      {action.status === "applied" ? (
        <div className="text-body text-green-700 font-medium">✓ Applied</div>
      ) : action.status === "rejected" ? (
        <div className="text-body text-red-600 font-medium">✗ Rejected</div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => onAccept?.(action, editing ? params : null)}
            className="flex-1 h-9 bg-green hover:bg-green/90 text-navy text-body font-medium rounded-lg flex items-center justify-center gap-1"
          >
            <Check size={14} /> Accept
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className="h-9 px-3 bg-white border border-gray-300 text-navy text-body rounded-lg hover:bg-page flex items-center gap-1"
          >
            <Edit3 size={14} /> Edit
          </button>
          <button
            onClick={() => onReject?.(action)}
            className="h-9 px-3 bg-white border border-red-300 text-red-600 text-body rounded-lg hover:bg-red-50 flex items-center gap-1"
          >
            <X size={14} /> Reject
          </button>
        </div>
      )}
    </div>
  )
}
