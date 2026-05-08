import { useState } from 'react'
import CampusMap from '../components/Map.jsx'
import AutopilotPanel from '../components/AutopilotPanel.jsx'
import ActionCard from '../components/ActionCard.jsx'
import RoleGuard from '../components/RoleGuard.jsx'
import LiveLocationMap from '../components/LiveLocationMap.jsx'
import StudyZoneHeatmap from '../components/StudyZoneHeatmap.jsx'
import FacultyEfficiencyPanel from '../components/FacultyEfficiencyPanel.jsx'
import { mockRooms, mockActions } from '../mockData.js'
import { useCampus } from '../context/CampusStateContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Zap, Building, Users, Wifi, GraduationCap, Briefcase } from 'lucide-react'
import QuickShortcuts from '../components/QuickShortcuts.jsx'

const StatTile = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-card p-4 border border-gray-100 flex items-center gap-3 shadow-sm">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center
      ${accent === "orange" ? "bg-orange/10 text-orange" :
        accent === "green"  ? "bg-green/20 text-green-700" :
        accent === "navy"   ? "bg-navy/10 text-navy" :
                              "bg-page text-textmute"}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-label uppercase tracking-wider text-textmute">{label}</p>
      <p className="text-stat font-medium text-navy leading-none mt-1">{value}</p>
    </div>
  </div>
)

export default function Dashboard() {
  const { updateImpact } = useCampus()
  const { user, can } = useAuth()
  const [actions, setActions] = useState(mockActions)
  
  const isStudent = user?.role === 'student'
  const isFaculty = user?.role === 'faculty_member'

  // Filter actions by role
  const visibleActions = actions.filter(a => {
    if (can("approve_actions")) return true
    return ["lighting", "hvac_minor"].includes(a.action_type)
  })

  const handlePipelineComplete = () => {
    updateImpact({
      energy_saved_kwh: 128.4,
      rooms_optimized: 42,
      crowd_score: 78,
      sustainability_index: 84,
      pending_approvals: 3,
      sensors_online: 28,
      sensors_total: 30,
    })
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
      {/* Role-specific Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-hero font-medium text-navy flex items-center gap-2">
            Welcome back, {user?.name?.split(' ')[0]} 
            {isStudent && <GraduationCap size={24} className="text-orange" />}
            {isFaculty && <Briefcase size={24} className="text-navy" />}
          </h2>
          <p className="text-body text-textmute mt-1">
            {isStudent ? "Find the best study spots and track your schedule." : 
             isFaculty ? "Monitor your department's efficiency and class impact." :
             "Manage the PESITM campus digital twin and optimization pipeline."}
          </p>
        </div>
      </div>
      {/* Stat row */}
      <div className="grid grid-cols-4 gap-4">
        <StatTile icon={Zap}      label="Energy Saved Today" value="128 kWh" accent="orange" />
        <StatTile icon={Building} label="Rooms Optimized"    value="42"      accent="navy" />
        <StatTile icon={Users}    label="Crowd Score"        value="78/100"  accent="green" />
        <StatTile icon={Wifi}     label="Sensors Online"     value="28/30"   accent="navy" />
      </div>

      {/* Quick Shortcuts (One-click) */}
      <QuickShortcuts />

      {/* Live Location Map */}
      <LiveLocationMap />

      {/* Differential Feature Section */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {isStudent ? (
            <StudyZoneHeatmap />
          ) : isFaculty ? (
            <div className="grid grid-cols-1 gap-4 h-full">
               <FacultyEfficiencyPanel />
            </div>
          ) : (
            <CampusMap rooms={mockRooms} />
          )}
        </div>
        <div>
          {isStudent || isFaculty ? (
             <div className="bg-navy text-white rounded-card p-6 h-full flex flex-col justify-center">
               <h3 className="text-nav font-bold mb-2">Did you know?</h3>
               <p className="text-body text-white/80 leading-relaxed">
                 Using 'Deep Work' zones instead of busy common areas reduces your CO₂ exposure by up to 15%, increasing your cognitive performance by 22%.
               </p>
               <button className="mt-6 w-full py-2 bg-orange text-white rounded-pill text-label font-bold hover:bg-orange/90 transition-all">
                 Learn More
               </button>
             </div>
          ) : (
            <RoleGuard cap="run_autopilot" fallback={
              <div className="bg-white rounded-card p-5 border border-gray-100 h-full flex flex-col items-center justify-center text-center shadow-sm">
                <p className="text-nav font-medium text-navy mb-1">Autopilot Restricted</p>
                <p className="text-body text-textmute">
                  Only Campus Management or IT Administration can run optimization.
                </p>
              </div>
            }>
              <AutopilotPanel onComplete={handlePipelineComplete} />
            </RoleGuard>
          )}
        </div>
      </div>

      {/* Only show full map for Management roles below features if they are students/faculty */}
      {(isStudent || isFaculty) && (
        <div>
          <h3 className="text-nav font-medium text-navy mb-3">Live Campus State</h3>
          <CampusMap rooms={mockRooms} />
        </div>
      )}

      {/* Action cards - Hide for students, they don't care about lighting controls usually */}
      {!isStudent && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-nav font-medium text-navy">Recent Actions</h3>
            <p className="text-body text-textmute">
              {visibleActions.length} visible to your role
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {visibleActions.map(a => (
              <ActionCard key={a.id} action={a}
                          onAccept={handleAccept} onReject={handleReject} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
