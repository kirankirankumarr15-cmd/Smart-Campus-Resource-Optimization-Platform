import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CampusStateProvider } from './context/CampusStateContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CampusStateProvider>
          <App />
        </CampusStateProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
