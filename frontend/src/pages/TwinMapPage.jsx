import { useState } from 'react'
import CampusMap from '../components/Map.jsx'
import { useCampus } from '../context/CampusStateContext.jsx'
import { Plus, X, Save } from 'lucide-react'

export default function TwinMapPage() {
  const { state, addRoom } = useCampus()
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newRoom, setNewRoom] = useState({
    code: 'A-000', block: 'A', floor: 0, capacity: 40,
    status: 'idle', type: 'classroom', department: 'CSE'
  })

  const handleAdd = () => {
    addRoom({
      ...newRoom,
      current_occupancy: 0
    })
    setShowAdd(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-hero font-medium text-navy">Digital Twin · Campus View</h2>
          <p className="text-body text-textmute mt-1">
            Campus › {selected ? `Block ${selected.block} › Floor ${selected.floor} › ${selected.code}` : "All Blocks"}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 h-10 bg-orange text-white rounded-pill text-body font-medium hover:bg-orange/90 transition-colors"
        >
          <Plus size={18} /> Add Room
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <CampusMap
            rooms={state.rooms}
            onRoomClick={setSelected}
            highlightRoomId={selected?.id}
          />
        </div>

        <div className="bg-white rounded-card p-5 border border-gray-100">
          {selected ? (
            <>
              <h3 className="text-nav font-medium text-navy mb-3">{selected.code}</h3>
              <Detail label="Block" value={`Block ${selected.block}`} />
              <Detail label="Floor" value={selected.floor === 0 ? "Ground" : selected.floor} />
              <Detail label="Department" value={selected.department} />
              <Detail label="Room Type" value={selected.type} />
              <Detail label="Capacity" value={selected.capacity} />
              <Detail label="Current Occupancy" value={`${selected.current_occupancy} / ${selected.capacity}`} />
              <Detail label="Status" value={selected.status} highlight />
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-label uppercase tracking-wider text-textmute mb-2">You Are Here</p>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange pulse-dot" />
                  <span className="text-body text-textmute">Estimated from timetable lookup</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-body text-textmute">Click any room tile to see details.</p>
          )}
        </div>
      </div>

      {/* Add Room Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-navy text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-nav font-semibold">Add New Room</h3>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-label uppercase tracking-wider text-textmute block mb-1">Room Code (e.g. A-101)</label>
                <input
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-body"
                  value={newRoom.code}
                  onChange={e => setNewRoom({...newRoom, code: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-label uppercase tracking-wider text-textmute block mb-1">Block</label>
                  <select
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg text-body"
                    value={newRoom.block}
                    onChange={e => setNewRoom({...newRoom, block: e.target.value, department: e.target.value === 'A' ? 'CSE' : e.target.value === 'B' ? 'ECE' : 'MECH'})}
                  >
                    <option>A</option><option>B</option><option>C</option>
                  </select>
                </div>
                <div>
                  <label className="text-label uppercase tracking-wider text-textmute block mb-1">Floor</label>
                  <select
                    className="w-full h-10 px-3 border border-gray-200 rounded-lg text-body"
                    value={newRoom.floor}
                    onChange={e => setNewRoom({...newRoom, floor: parseInt(e.target.value)})}
                  >
                    <option value={0}>Ground</option><option value={1}>1</option><option value={2}>2</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-label uppercase tracking-wider text-textmute block mb-1">Capacity</label>
                <input
                  type="number"
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-body"
                  value={newRoom.capacity}
                  onChange={e => setNewRoom({...newRoom, capacity: parseInt(e.target.value)})}
                />
              </div>
              <button
                onClick={handleAdd}
                className="w-full h-11 bg-orange text-white rounded-pill text-body font-medium flex items-center justify-center gap-2 mt-2 hover:bg-orange/90 transition-colors"
              >
                <Save size={18} /> Register Room in Twin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Detail = ({ label, value, highlight }) => (
  <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-b-0">
    <span className="text-body text-textmute">{label}</span>
    <span className={`text-body ${highlight ? "text-orange font-medium" : "text-navy"}`}>
      {value}
    </span>
  </div>
)
