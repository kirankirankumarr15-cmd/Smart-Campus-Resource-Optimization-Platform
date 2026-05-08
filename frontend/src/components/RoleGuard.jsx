import { useAuth } from '../context/AuthContext.jsx'

/**
 * RoleGuard — hides children unless user has the given capability.
 * Usage: <RoleGuard cap="run_autopilot"><AutopilotPanel /></RoleGuard>
 */
export default function RoleGuard({ cap, fallback = null, children }) {
  const { can } = useAuth()
  if (!can(cap)) return fallback
  return children
}
