import { useAuth } from '../context/AuthContext.jsx'

export default function Settings() {
  const { user } = useAuth()
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-hero font-medium text-navy">Settings</h2>
        <p className="text-body text-textmute mt-1">
          Profile, preferences, and learning history.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-card p-5 border border-gray-100">
          <h3 className="text-nav font-medium text-navy mb-3">Profile</h3>
          <Row label="Name" value={user?.name} />
          <Row label="Email" value={user?.email} />
          <Row label="Role" value={user?.role?.replace(/_/g, " ")} />
          <Row label="Institute" value="PESITM · PES Institute of Technology & Management, Shivamogga" />
        </div>

        <div className="bg-white rounded-card p-5 border border-gray-100">
          <h3 className="text-nav font-medium text-navy mb-3">My Optimization Preferences</h3>
          <p className="text-body text-textmute mb-3">
            History of your Accept / Edit / Reject decisions. Used by the Learning System.
          </p>
          <Row label="Total decisions" value="42" />
          <Row label="Accepted" value="29" highlight />
          <Row label="Edited" value="9" />
          <Row label="Rejected" value="4" />
          <Row label="Auto-tuned actions" value="7" highlight />
        </div>
      </div>
    </div>
  )
}

const Row = ({ label, value, highlight }) => (
  <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-body text-textmute">{label}</span>
    <span className={`text-body ${highlight ? "text-orange font-medium" : "text-navy"}`}>{value}</span>
  </div>
)
