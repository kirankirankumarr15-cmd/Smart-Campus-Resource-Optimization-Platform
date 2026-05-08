import { useState } from 'react'

const STATUS_STYLES = {
  free:     { bg: "#c0dd97", text: "#27500a", label: "Free" },
  moderate: { bg: "#fac775", text: "#633806", label: "Moderate" },
  crowded:  { bg: "#f09595", text: "#791f1f", label: "Crowded" },
  active:   { bg: "#85b7eb", text: "#0c447c", label: "Active" },
  idle:     { bg: "#e8e8f0", text: "#888888", label: "Idle" },
}

export default function CampusMap({ rooms = [], onRoomClick, highlightRoomId }) {
  const [activeBlock, setActiveBlock] = useState("A")
  const filtered = rooms.filter(r => r.block === activeBlock)
  // Group by floor
  const floors = {}
  filtered.forEach(r => {
    floors[r.floor] = floors[r.floor] || []
    floors[r.floor].push(r)
  })

  return (
    <div className="bg-white rounded-card p-5 border border-gray-100">
      {/* Block tabs */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-nav font-medium text-navy">Digital Twin · Live Campus State</h3>
        <div className="flex gap-1 bg-page rounded-pill p-1">
          {["A", "B", "C"].map(b => (
            <button
              key={b}
              onClick={() => setActiveBlock(b)}
              className={`px-4 py-1 rounded-pill text-body transition-colors
                ${activeBlock === b ? "bg-navy text-white" : "text-textmute hover:text-navy"}`}
            >
              Block {b}
            </button>
          ))}
        </div>
      </div>

      {/* Floor-wise tile grid */}
      <div className="space-y-4">
        {Object.keys(floors).sort((a, b) => +b - +a).map(floor => (
          <div key={floor}>
            <p className="text-label uppercase tracking-wider text-textmute mb-2">
              Floor {floor === "0" ? "Ground" : floor}
            </p>
            <div className="grid grid-cols-9 gap-1.5">
              {floors[floor].map(r => {
                const s = STATUS_STYLES[r.status] || STATUS_STYLES.idle
                const isHighlight = r.id === highlightRoomId
                return (
                  <button
                    key={r.id}
                    onClick={() => onRoomClick?.(r)}
                    title={`${r.code} · ${s.label} · ${r.current_occupancy}/${r.capacity}`}
                    className={`relative aspect-square rounded-md text-label font-medium
                                flex items-center justify-center transition-transform hover:scale-105
                                ${isHighlight ? "ring-2 ring-orange" : ""}`}
                    style={{ backgroundColor: s.bg, color: s.text }}
                  >
                    {r.code.split('-')[1]}
                    {isHighlight && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange rounded-full pulse-dot" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-gray-100">
        {Object.entries(STATUS_STYLES).map(([k, s]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: s.bg }} />
            <span className="text-body text-textmute">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
