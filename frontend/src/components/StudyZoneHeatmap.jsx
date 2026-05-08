import { useCampus } from '../context/CampusStateContext.jsx'
import { BookOpen, MapPin, Wind, Thermometer, Users } from 'lucide-react'

export default function StudyZoneHeatmap() {
  const { state } = useCampus()
  
  // Find top "Deep Work" zones
  // Criteria: Free/Moderate status, low occupancy, good air quality (simulated)
  const zones = state.rooms
    .filter(r => r.status === 'free' || r.status === 'moderate')
    .map(r => {
      const co2 = 400 + Math.floor(Math.random() * 300) // 400-700 ppm is fresh
      const focusScore = Math.floor(90 - (r.current_occupancy / r.capacity * 40) - (co2 / 100))
      return { ...r, co2, focusScore }
    })
    .sort((a, b) => b.focusScore - a.focusScore)
    .slice(0, 3)

  return (
    <div className="bg-white rounded-card p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-orange" />
          <h3 className="text-nav font-medium text-navy">Live Deep-Work Zones</h3>
        </div>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-label rounded-full font-medium">
          Top Rated
        </span>
      </div>

      <div className="space-y-3">
        {zones.map(zone => (
          <div key={zone.id} className="p-4 bg-page rounded-xl border border-gray-100 flex items-center justify-between group hover:border-orange/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-orange font-bold text-nav">
                {zone.focusScore}%
              </div>
              <div>
                <p className="text-nav font-medium text-navy group-hover:text-orange transition-colors">
                  {zone.code} · Block {zone.block}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-label text-textmute">
                    <Users size={12} /> {zone.current_occupancy}/{zone.capacity}
                  </span>
                  <span className="flex items-center gap-1 text-label text-textmute">
                    <Wind size={12} /> {zone.co2} ppm
                  </span>
                  <span className="flex items-center gap-1 text-label text-textmute">
                    <Thermometer size={12} /> 22°C
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-label uppercase tracking-wider text-textmute mb-1">Focus Score</p>
              <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange" 
                  style={{ width: `${zone.focusScore}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-label text-textmute mt-4 italic text-center">
        Real-time recommendation based on noise, CO₂ levels, and current occupancy.
      </p>
    </div>
  )
}
