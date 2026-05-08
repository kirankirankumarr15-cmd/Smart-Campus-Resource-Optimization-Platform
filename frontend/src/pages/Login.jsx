import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import PesitmLogo from '../components/PesitmLogo.jsx'

const ROLES = [
  { value: "student",              label: "Student" },
  { value: "faculty",              label: "Faculty Member" },
  { value: "academic_scheduling",  label: "Academic Scheduling Team" },
  { value: "facility_maintenance", label: "Facility Maintenance" },
  { value: "energy_management",    label: "Energy Management Team" },
  { value: "campus_security",      label: "Campus Security" },
  { value: "it_administration",    label: "IT Administration" },
  { value: "campus_management",    label: "Campus Management" },
]

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("campus_management")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const nav = useNavigate()

  const handleSubmit = async () => {
    setError("")
    try {
      // For hackathon demo, allow direct mock login
      const userData = {
        email, role,
        name: ROLES.find(r => r.value === role)?.label || "User"
      }
      login(userData, "mock-jwt-" + Date.now())
      nav("/")
    } catch (e) {
      setError("Login failed. Try demo credentials.")
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-navy">
      <div className="w-full max-w-[400px] mx-4 bg-white rounded-card p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full p-1 bg-white">
            <PesitmLogo size={84} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-hero font-medium text-center text-navy">Campus Autopilot</h1>
        <p className="text-body text-center text-textmute mt-1 mb-6">
          PESITM Shivamogga · Smart Resource Platform
        </p>

        {/* Fields */}
        <label className="text-label uppercase tracking-wider text-textmute">Institute Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 mb-4 px-3 py-2.5 border border-gray-200 rounded-lg text-body
                     focus:outline-none focus:ring-2 focus:ring-orange/40"
          placeholder="[email protected]"
        />

        <label className="text-label uppercase tracking-wider text-textmute">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 mb-4 px-3 py-2.5 border border-gray-200 rounded-lg text-body
                     focus:outline-none focus:ring-2 focus:ring-orange/40"
          placeholder="••••••••"
        />

        <label className="text-label uppercase tracking-wider text-textmute">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mt-1 mb-5 px-3 py-2.5 border border-gray-200 rounded-lg text-body bg-white"
        >
          {ROLES.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        {error && <p className="text-body text-red-600 mb-3">{error}</p>}

        {/* Primary CTA */}
        <button
          onClick={handleSubmit}
          className="w-full h-11 bg-orange hover:bg-orange/90 text-white text-nav font-medium
                     rounded-pill transition-colors"
        >
          Log in to Campus Autopilot
        </button>

        {/* Secondary - Google Sign In (Demo) */}
        <button
          onClick={() => {
            // Demo: auto-login as campus management via Google Workspace simulation
            const googleUser = {
              email: 'admin@pesitm.edu.in',
              role: 'campus_management',
              name: 'Campus Management',
              googleAuth: true,
            }
            login(googleUser, 'google-mock-jwt-' + Date.now())
            nav('/')
          }}
          className="w-full h-11 mt-3 bg-white border border-gray-300 text-navy text-nav
                     rounded-pill hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google Workspace
        </button>

        {/* Footer */}
        <div className="text-center mt-5">
          <a className="text-body text-orange hover:underline cursor-pointer">Forgot password?</a>
        </div>

        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-label text-textmute">
            🔒 Privacy-First · Aggregated Data Only
          </p>
        </div>
      </div>
    </div>
  )
}
