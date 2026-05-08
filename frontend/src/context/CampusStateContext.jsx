import { createContext, useContext, useState } from 'react'
import { mockRooms } from '../mockData.js'

const CampusStateContext = createContext(null)

export function CampusStateProvider({ children }) {
  const [state, setState] = useState({
    rooms: mockRooms, // Initialize with mock data
    actions: [],
    impact: {
      energy_saved_kwh: 0,
      rooms_optimized: 0,
      crowd_score: 0,
      sustainability_index: 0,
      pending_approvals: 0,
      sensors_online: 0,
      sensors_total: 0,
    },
    lastRunId: null,
  })

  const updateImpact = (delta) =>
    setState((s) => ({ ...s, impact: { ...s.impact, ...delta } }))

  const addRoom = (room) => {
    setState((s) => ({
      ...s,
      rooms: [...s.rooms, { ...room, id: s.rooms.length + 1 }]
    }))
  }

  const updateRoom = (id, delta) => {
    setState((s) => ({
      ...s,
      rooms: s.rooms.map(r => r.id === id ? { ...r, ...delta } : r)
    }))
  }

  return (
    <CampusStateContext.Provider value={{ state, setState, updateImpact, addRoom, updateRoom }}>
      {children}
    </CampusStateContext.Provider>
  )
}

export function useCampus() {
  return useContext(CampusStateContext)
}
