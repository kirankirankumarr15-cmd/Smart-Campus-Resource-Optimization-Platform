import { useState } from 'react'
import CampusMap from './Map.jsx'
import { mockRooms } from '../mockData.js'
import { CheckCircle2, Loader2, X, AlertTriangle } from 'lucide-react'

function CommitModal({ delta, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         onClick={!loading ? onClose : undefined}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px]"
           onClick={e => e.stopPropagation()}>
        <div className="bg-orange text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} />
            <p className="text-nav font-semibold">Commit Scenario to Live Twin</p>
          </div>
          {!loading && (
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="p-6 space-y-4">
          <p className="text-body text-navy">
            This will apply the simulated headcount distribution to the <strong>live campus digital twin</strong>.
            All downstream systems (HVAC, lighting, scheduling) will adjust accordingly.
          </p>

          <div className="bg-page rounded-xl p-4 space-y-2">
            <p className="text-label uppercase tracking-wider text-textmute">Impact Preview</p>
            <div className="flex justify-between text-body">
              <span className="text-textmute">Δ Energy demand</span>
              <span className="font-medium text-orange">+{delta?.energy ?? 0} kWh</span>
            </div>
            <div className="flex justify-between text-body">
              <span className="text-textmute">Δ Crowd pressure</span>
              <span className="font-medium text-red-600">+{delta?.crowd ?? 0}%</span>
            </div>
            <div className="flex justify-between text-body">
              <span className="text-textmute">Δ Room utilization</span>
              <span className="font-medium text-green-700">+{delta?.util ?? 0}%</span>
            </div>
          </div>

          <p className="text-label text-textmute">
            ⚠ This action requires IT Administration or Campus Management authority.
          </p>
        </div>

        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-10 bg-orange hover:bg-orange/90 disabled:opacity-70 text-white
                       text-body font-medium rounded-pill flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            {loading ? 'Committing…' : 'Confirm Commit'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 h-10 border border-gray-200 text-navy text-body rounded-pill hover:bg-gray-50 disabled:opacity-50"
          >
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
                    flex items-center gap-3 z-50">
      <CheckCircle2 size={18} />
      <p className="text-body font-medium">{msg}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-80"><X size={14} /></button>
    </div>
  )
}

export default function ScenarioSim() {
  const [block, setBlock] = useState("A")
  const [headcount, setHeadcount] = useState(200)
  const [time, setTime] = useState("15:00")
  const [simulated, setSimulated] = useState(null)
  const [delta, setDelta] = useState(null)
  const [showCommitModal, setShowCommitModal] = useState(false)
  const [committing, setCommitting] = useState(false)
  const [committed, setCommitted] = useState(false)
  const [toast, setToast] = useState(null)

  const runSim = () => {
    setCommitted(false)
    const sim = mockRooms.map(r => ({ ...r }))
    const blockRooms = sim.filter(r => r.block === block)
    const perRoom = headcount / Math.max(blockRooms.length, 1)
    blockRooms.forEach(r => {
      r.current_occupancy = Math.round(perRoom)
      const ratio = perRoom / r.capacity
      if (ratio > 0.85) r.status = "crowded"
      else if (ratio > 0.5) r.status = "moderate"
      else r.status = "free"
    })
    setSimulated(sim)
    setDelta({
      energy: Math.round(headcount * 0.05),
      crowd: Math.round((headcount / blockRooms.reduce((a, r) => a + r.capacity, 1)) * 100),
      util: Math.round(headcount * 0.02),
    })
  }

  const handleCommitConfirm = () => {
    setCommitting(true)
    // Simulate API commit delay
    setTimeout(() => {
      setCommitting(false)
      setShowCommitModal(false)
      setCommitted(true)
      setToast(`Scenario committed to live twin — Block ${block} updated with ${headcount} headcount`)
      setTimeout(() => setToast(null), 5000)
    }, 2000)
  }

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="bg-white rounded-card p-4 border border-gray-100 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-label uppercase tracking-wider text-textmute block">Block</label>
          <select value={block} onChange={(e) => setBlock(e.target.value)}
                  className="mt-1 px-3 py-2 border border-gray-200 rounded-lg text-body">
            <option>A</option><option>B</option><option>C</option>
          </select>
        </div>
        <div>
          <label className="text-label uppercase tracking-wider text-textmute block">Headcount</label>
          <input type="number" value={headcount} onChange={(e) => setHeadcount(+e.target.value)}
                 className="mt-1 px-3 py-2 border border-gray-200 rounded-lg text-body w-32" />
        </div>
        <div>
          <label className="text-label uppercase tracking-wider text-textmute block">Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                 className="mt-1 px-3 py-2 border border-gray-200 rounded-lg text-body" />
        </div>
        <button onClick={runSim}
                className="h-10 px-5 bg-orange hover:bg-orange/90 text-white text-body font-medium rounded-pill transition-colors">
          Simulate Scenario
        </button>
        <button
          disabled={!simulated}
          onClick={() => setShowCommitModal(true)}
          className={`h-10 px-5 text-white text-body font-medium rounded-pill flex items-center gap-2 transition-colors
            ${committed
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-navy disabled:opacity-50 hover:bg-navy/90'}`}
        >
          {committed ? <><CheckCircle2 size={15} /> Committed</> : 'Commit This Scenario'}
        </button>
      </div>

      {/* Delta strip */}
      {delta && (
        <div className="bg-page rounded-card p-3 flex items-center justify-around text-body">
          <span>Δ Energy: <strong className="text-orange">+{delta.energy} kWh</strong></span>
          <span>Δ Crowd: <strong className="text-red-600">+{delta.crowd}%</strong></span>
          <span>Δ Utilization: <strong className="text-green-700">+{delta.util}%</strong></span>
        </div>
      )}

      {/* Split-screen */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-label uppercase tracking-wider text-textmute mb-2">Current State</p>
          <CampusMap rooms={mockRooms} />
        </div>
        <div>
          <p className="text-label uppercase tracking-wider text-textmute mb-2">
            Simulated State {committed && <span className="text-green-700">(Live ✓)</span>}
          </p>
          <CampusMap rooms={simulated || mockRooms} />
        </div>
      </div>

      {/* Commit Modal */}
      {showCommitModal && (
        <CommitModal
          delta={delta}
          onClose={() => !committing && setShowCommitModal(false)}
          onConfirm={handleCommitConfirm}
          loading={committing}
        />
      )}

      {/* Toast */}
      {toast && <SuccessToast msg={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
