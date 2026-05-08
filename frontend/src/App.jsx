import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TwinMapPage from './pages/TwinMapPage.jsx'
import Actions from './pages/Actions.jsx'
import Navigator from './pages/Navigator.jsx'
import Scenarios from './pages/Scenarios.jsx'
import Maintenance from './pages/Maintenance.jsx'
import ImpactDashboard from './pages/ImpactDashboard.jsx'
import IoTSensors from './pages/IoTSensors.jsx'
import Settings from './pages/Settings.jsx'
import FacultySchedule from './pages/FacultySchedule.jsx'
import Layout from './components/Layout.jsx'

function Protected({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/twin" element={<Protected><TwinMapPage /></Protected>} />
      <Route path="/actions" element={<Protected><Actions /></Protected>} />
      <Route path="/navigator" element={<Protected><Navigator /></Protected>} />
      <Route path="/scenarios" element={<Protected><Scenarios /></Protected>} />
      <Route path="/maintenance" element={<Protected><Maintenance /></Protected>} />
      <Route path="/impact" element={<Protected><ImpactDashboard /></Protected>} />
      <Route path="/iot" element={<Protected><IoTSensors /></Protected>} />
      <Route path="/settings" element={<Protected><Settings /></Protected>} />
      <Route path="/schedule" element={<Protected><FacultySchedule /></Protected>} />
    </Routes>
  )
}
