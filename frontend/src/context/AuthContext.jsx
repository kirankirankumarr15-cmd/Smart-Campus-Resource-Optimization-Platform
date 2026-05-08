import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const stored = window.sessionStorage?.getItem?.('cap_auth')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed.user)
        setToken(parsed.token)
      } catch {}
    }
  }, [])

  const login = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    try {
      window.sessionStorage?.setItem?.('cap_auth',
        JSON.stringify({ user: userData, token: jwt }))
    } catch {}
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    try { window.sessionStorage?.removeItem?.('cap_auth') } catch {}
  }

  // Helper checks
  const can = (capability) => {
    if (!user) return false
    const role = user.role
    const matrix = {
      run_autopilot:   ["campus_management", "it_administration"],
      view_iot:        ["facility_maintenance", "energy_management",
                        "campus_security", "it_administration", "campus_management"],
      send_iot_cmd:    ["campus_management", "it_administration", "energy_management"],
      approve_actions: ["campus_management", "it_administration",
                        "academic_scheduling", "energy_management"],
      view_maintenance:["facility_maintenance", "campus_management", "it_administration"],
      view_impact:     ["campus_management", "it_administration", "energy_management"],
      view_security:   ["campus_security", "campus_management", "it_administration"],
    }
    return (matrix[capability] || []).includes(role)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
