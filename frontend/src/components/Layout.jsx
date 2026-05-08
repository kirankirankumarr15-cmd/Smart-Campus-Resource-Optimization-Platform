import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import ImpactBar from './ImpactBar.jsx'
import AIChatbot from './AIChatbot.jsx'

export default function Layout({ children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-page">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </main>
        <ImpactBar />
        <footer className="bg-white border-t border-gray-200 px-6 py-2 text-label text-textmute text-center">
          🔒 Privacy-First · Aggregated Data Only · No Personal Tracking · © PESITM Campus Autopilot 2026
        </footer>
      </div>
      <AIChatbot />
    </div>
  )
}
