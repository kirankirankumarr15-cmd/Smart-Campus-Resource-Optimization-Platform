import PesitmLogo from './PesitmLogo.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import NotificationPanel from './NotificationPanel.jsx'

export default function Topbar() {
  const { user } = useAuth()
  return (
    <header className="h-[60px] bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <PesitmLogo size={36} />
        <div>
          <p className="text-nav font-medium text-navy leading-tight">Campus Autopilot</p>
          <p className="text-label text-textmute leading-tight">PESITM · Shivamogga</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationPanel />
        <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-body font-medium">
          {user?.name?.[0] || "U"}
        </div>
      </div>
    </header>
  )
}
