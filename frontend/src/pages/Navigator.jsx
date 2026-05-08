import { useState } from 'react'
import { useCampus } from '../context/CampusStateContext.jsx'
import { Compass, MapPin, Navigation, ExternalLink, X } from 'lucide-react'

// PESITM Shivamogga campus block coordinates
const BLOCK_COORDS = {
  A: { lat: 13.9340, lng: 75.5638, label: 'Block A – CSE Wing' },
  B: { lat: 13.9334, lng: 75.5645, label: 'Block B – ECE Wing' },
  C: { lat: 13.9337, lng: 75.5652, label: 'Block C – MECH Wing' },
}

const FLOOR_LABEL = { 0: 'Ground Floor', 1: 'Floor 1', 2: 'Floor 2' }

function RouteModal({ room, onClose }) {
  const [traveling, setTraveling] = useState(false)
  const coords = BLOCK_COORDS[room.block]

  const openGoogleMapsRoute = () => {
    setTraveling(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const dest = `${coords.lat},${coords.lng}`
          const betterUrl = `https://www.google.com/maps/dir/?api=1&origin=${pos.coords.latitude},${pos.coords.longitude}&destination=${coords.lat},${coords.lng}&travelmode=walking`
          window.open(betterUrl, '_blank')
          setTraveling(false)
        },
        () => {
          const gate = "13.9348,75.5625"
          const betterUrl = `https://www.google.com/maps/dir/?api=1&origin=${gate}&destination=${coords.lat},${coords.lng}&travelmode=walking`
          window.open(betterUrl, '_blank')
          setTraveling(false)
        },
        { timeout: 5000 }
      )
    } else {
      const gate = "13.9348,75.5625"
      const betterUrl = `https://www.google.com/maps/dir/?api=1&origin=${gate}&destination=${coords.lat},${coords.lng}&travelmode=walking`
      window.open(betterUrl, '_blank')
      setTraveling(false)
    }
  }

  const navSteps = [
    `Enter through the Main Sagar Road Gate`,
    `Pass the Administrative Block on your right side`,
    `Continue straight past the Open-Air Theater (OAT)`,
    `Turn ${room.block === 'A' ? 'left' : room.block === 'B' ? 'right' : 'straight'} towards ${coords.label}`,
    `Take the stairs/lift to ${FLOOR_LABEL[room.floor] || `Floor ${room.floor}`}`,
    `Locate ${room.type} ${room.code} along the main corridor`,
  ]

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={e => e.stopPropagation()}>
        <div className="bg-navy text-white px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-nav font-semibold">Route to {room.code}</p>
            <p className="text-label text-white/60">{coords.label} · {FLOOR_LABEL[room.floor] || 'Floor ' + room.floor}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="relative" style={{ height: 200 }}>
          <iframe
            title="Route Map"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=75.5600%2C13.9310%2C75.5690%2C13.9370&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
            style={{ width: '100%', height: '100%', border: 0 }}
            loading="lazy"
          />
        </div>

        <div className="px-6 py-4 space-y-3">
          <p className="text-label uppercase tracking-wider text-textmute">Campus Navigation Steps</p>
          <ol className="space-y-2">
            {navSteps.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-orange/10 text-orange text-label font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-body text-navy">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={openGoogleMapsRoute}
            disabled={traveling}
            className="flex-1 h-10 bg-orange hover:bg-orange/90 disabled:opacity-60 text-white text-body font-medium rounded-pill flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink size={15} />
            {traveling ? 'Getting Location…' : 'Open in Google Maps'}
          </button>
          <button onClick={onClose}
                  className="px-4 h-10 border border-gray-200 text-navy text-body rounded-pill hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Navigator() {
  const { state } = useCampus()
  const [capacity, setCapacity] = useState(40)
  const [block, setBlock] = useState("any")
  const [time, setTime] = useState("14:00")
  const [results, setResults] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)

  const search = () => {
    const hour = parseInt(time.split(':')[0])
    const isPeak = (hour >= 9 && hour <= 12) || (hour >= 14 && hour <= 16)
    
    const matches = state.rooms
      .filter(r => r.capacity >= capacity)
      .filter(r => block === "any" || r.block === block)
      .filter(r => {
        if (!isPeak) return ["free", "moderate", "active", "idle"].includes(r.status)
        return ["free", "moderate"].includes(r.status) && Math.random() > 0.2
      })
      .map(r => {
        let conf = r.status === "free" ? 95 : 75
        if (isPeak) conf -= 15
        conf += Math.floor(Math.random() * 10)
        return { ...r, confidence: Math.min(conf, 99) }
      })
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5)
    setResults(matches)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-hero font-medium text-navy">Find Best Room For Me</h2>
        <p className="text-body text-textmute mt-1">
          Indoor + outdoor navigation with availability confidence.
        </p>
      </div>

      <div className="bg-white rounded-card p-5 border border-gray-100 grid grid-cols-4 gap-3 items-end shadow-sm">
        <div>
          <label className="text-label uppercase tracking-wider text-textmute block">Capacity Needed</label>
          <input type="number" value={capacity} onChange={(e) => setCapacity(+e.target.value)}
                 className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-body focus:ring-1 focus:ring-orange focus:border-orange outline-none" />
        </div>
        <div>
          <label className="text-label uppercase tracking-wider text-textmute block">Block</label>
          <select value={block} onChange={(e) => setBlock(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-body focus:ring-1 focus:ring-orange focus:border-orange outline-none">
            <option value="any">Any</option><option>A</option><option>B</option><option>C</option>
          </select>
        </div>
        <div>
          <label className="text-label uppercase tracking-wider text-textmute block">Time Window</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                 className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-body focus:ring-1 focus:ring-orange focus:border-orange outline-none" />
        </div>
        <button onClick={search}
                className="h-10 bg-orange hover:bg-orange/90 text-white text-body font-medium rounded-pill flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95">
          <Compass size={16} /> Find Best Room
        </button>
      </div>

      {results.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-nav font-medium text-navy mb-3">Top Matches</h3>
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={r.id} className="bg-white rounded-card p-4 border border-gray-100 flex items-center justify-between hover:border-orange/30 transition-colors shadow-sm group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-page flex items-center justify-center text-navy text-nav font-medium group-hover:bg-orange/10 group-hover:text-orange transition-colors">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-nav font-medium text-navy">{r.code}</p>
                    <p className="text-body text-textmute">
                      Block {r.block} · Floor {r.floor === 0 ? 'Ground' : r.floor} · {r.type} · Capacity {r.capacity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-stat font-medium text-green-700 leading-none">{r.confidence}%</p>
                    <p className="text-label uppercase tracking-wider text-textmute mt-0.5">Predicted Availability</p>
                  </div>
                  <button
                    onClick={() => setSelectedRoom(r)}
                    className="h-9 px-4 bg-navy text-white text-body rounded-pill flex items-center gap-1.5 hover:bg-navy/90 transition-all active:scale-95 shadow-sm"
                  >
                    <MapPin size={14} /> View Route
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRoom && (
        <RouteModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  )
}
