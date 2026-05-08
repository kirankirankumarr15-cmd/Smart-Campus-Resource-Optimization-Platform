import { useState } from 'react'
import { mockRooms } from '../mockData.js'
import { Wrench, AlertCircle, Clock, Calendar, X, CheckCircle2, User, ChevronDown } from 'lucide-react'

const PRIORITY_STYLES = {
  urgent:        { bg: "bg-red-100",    text: "text-red-700",    icon: AlertCircle },
  routine:       { bg: "bg-amber-100",  text: "text-amber-700",  icon: Clock },
  opportunistic: { bg: "bg-green/20",   text: "text-green-700",  icon: Calendar },
}

const FACILITY_STAFF = [
  { id: 1, name: 'Ramesh Kumar',   dept: 'Electrical',  phone: '+91-9876543210', available: true },
  { id: 2, name: 'Suresh Patil',   dept: 'Civil',       phone: '+91-9876543211', available: true },
  { id: 3, name: 'Anitha Sharma',  dept: 'HVAC',        phone: '+91-9876543212', available: false },
  { id: 4, name: 'Mohan Raj',      dept: 'Electrical',  phone: '+91-9876543213', available: true },
  { id: 5, name: 'Prakash Hegde',  dept: 'Plumbing',    phone: '+91-9876543214', available: true },
  { id: 6, name: 'Kavitha Nair',   dept: 'Cleaning',    phone: '+91-9876543215', available: true },
]

function buildSlots() {
  const now = new Date()
  return mockRooms.filter(r => ["idle", "free"].includes(r.status)).slice(0, 12).map((r, i) => {
    const priority = r.id % 5 === 0 ? "urgent" : r.id % 3 === 0 ? "routine" : "opportunistic"
    const start = new Date(now.getTime() + (i + 1) * 90 * 60_000)
    const end = new Date(start.getTime() + 2 * 60 * 60_000)
    return { ...r, priority, start, end, confidence: 70 + (i * 2) % 25, assignedTo: null }
  })
}

function AssignModal({ slot, onClose, onAssign }) {
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px]"
           onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-navy text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <p className="text-nav font-semibold">Assign Maintenance Task</p>
            <p className="text-label text-white/60">{slot.code} · Block {slot.block}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Task info */}
        <div className={`mx-6 mt-4 rounded-xl p-3 ${PRIORITY_STYLES[slot.priority].bg}`}>
          <p className={`text-label uppercase font-semibold ${PRIORITY_STYLES[slot.priority].text}`}>
            {slot.priority} priority
          </p>
          <p className="text-body text-navy mt-0.5">
            Window: {slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {slot.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-label text-textmute">Trough confidence: {slot.confidence}%</p>
        </div>

        {/* Staff list */}
        <div className="px-6 py-4 space-y-2">
          <p className="text-label uppercase tracking-wider text-textmute mb-2">Select Facility Staff</p>
          {FACILITY_STAFF.map(staff => (
            <button
              key={staff.id}
              onClick={() => staff.available && setSelected(staff)}
              disabled={!staff.available}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                ${!staff.available ? 'opacity-40 cursor-not-allowed border-gray-100' :
                  selected?.id === staff.id
                    ? 'border-orange bg-orange/5 ring-2 ring-orange/30'
                    : 'border-gray-100 hover:border-navy/30 hover:bg-page'}`}
            >
              <div className="w-8 h-8 rounded-full bg-navy/10 text-navy flex items-center justify-center text-nav font-medium shrink-0">
                {staff.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-body font-medium text-navy">{staff.name}</p>
                <p className="text-label text-textmute">{staff.dept} · {staff.phone}</p>
              </div>
              <span className={`text-label px-2 py-0.5 rounded-full ${staff.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-textmute'}`}>
                {staff.available ? 'Available' : 'Busy'}
              </span>
            </button>
          ))}
        </div>

        {/* Note */}
        <div className="px-6 pb-2">
          <label className="text-label uppercase tracking-wider text-textmute block mb-1">Note (optional)</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            placeholder="Any special instructions for the maintenance team…"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-body resize-none focus:outline-none focus:ring-2 focus:ring-orange/30"
          />
        </div>

        {/* Buttons */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={() => selected && onAssign(slot, selected, note)}
            disabled={!selected}
            className="flex-1 h-10 bg-orange hover:bg-orange/90 disabled:opacity-50 text-white
                       text-body font-medium rounded-pill flex items-center justify-center gap-2 transition-colors"
          >
            <User size={15} /> Assign to {selected?.name || 'Staff'}
          </button>
          <button onClick={onClose}
                  className="px-4 h-10 border border-gray-200 text-navy text-body rounded-pill hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function SuccessToast({ msg, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-2xl
                    flex items-center gap-3 z-50 animate-bounce-once">
      <CheckCircle2 size={18} />
      <p className="text-body font-medium">{msg}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-80"><X size={14} /></button>
    </div>
  )
}

export default function Maintenance() {
  const [slots, setSlots] = useState(buildSlots)
  const [assignModal, setAssignModal] = useState(null)
  const [toast, setToast] = useState(null)

  const handleAssign = (slot, staff, note) => {
    setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, assignedTo: staff, note } : s))
    setAssignModal(null)
    setToast(`Task assigned to ${staff.name} for ${slot.code}`)
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-hero font-medium text-navy">Smart Maintenance Scheduler</h2>
        <p className="text-body text-textmute mt-1">
          AI-suggested maintenance windows during low-usage troughs.
        </p>
      </div>

      {/* Priority summary */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(PRIORITY_STYLES).map(([key, s]) => {
          const count = slots.filter(sl => sl.priority === key).length
          const assigned = slots.filter(sl => sl.priority === key && sl.assignedTo).length
          const Icon = s.icon
          return (
            <div key={key} className={`${s.bg} rounded-card p-4`}>
              <div className="flex items-center gap-3">
                <Icon size={20} className={s.text} />
                <div>
                  <p className={`text-stat font-medium ${s.text} leading-none`}>{count}</p>
                  <p className={`text-label uppercase tracking-wider ${s.text} mt-1`}>{key} slots</p>
                </div>
              </div>
              <p className="text-label mt-2 text-textmute">{assigned}/{count} assigned</p>
            </div>
          )
        })}
      </div>

      {/* Schedule list */}
      <div>
        <h3 className="text-nav font-medium text-navy mb-3">Suggested Windows</h3>
        <div className="space-y-3">
          {slots.map(s => {
            const ps = PRIORITY_STYLES[s.priority]
            const Icon = ps.icon
            return (
              <div key={s.id} className="bg-white rounded-card p-4 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${ps.bg} flex items-center justify-center`}>
                    <Icon size={18} className={ps.text} />
                  </div>
                  <div>
                    <p className="text-nav font-medium text-navy">{s.code} · Block {s.block}</p>
                    <p className="text-body text-textmute">
                      {s.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                      {s.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ·
                      Trough confidence {s.confidence}%
                    </p>
                    {s.assignedTo && (
                      <p className="text-label text-green-700 mt-0.5 flex items-center gap-1">
                        <CheckCircle2 size={11} /> Assigned to {s.assignedTo.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-label uppercase tracking-wider ${ps.bg} ${ps.text}`}>
                    {s.priority}
                  </span>
                  <button
                    onClick={() => setAssignModal(s)}
                    className={`h-9 px-4 text-white text-body rounded-pill flex items-center gap-1.5 transition-colors
                      ${s.assignedTo ? 'bg-green-600 hover:bg-green-700' : 'bg-navy hover:bg-navy/90'}`}
                  >
                    <Wrench size={14} />
                    {s.assignedTo ? 'Reassign' : 'Assign to Facility'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Assign Modal */}
      {assignModal && (
        <AssignModal
          slot={assignModal}
          onClose={() => setAssignModal(null)}
          onAssign={handleAssign}
        />
      )}

      {/* Toast */}
      {toast && <SuccessToast msg={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
