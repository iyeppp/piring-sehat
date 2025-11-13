import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'

function MainApp() {
  const [username, setUsername] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (usernameInput, emailInput) => {
    setUsername(usernameInput)
    setUserEmail(emailInput)
    setIsAuthenticated(true)
  }

  const handleRegister = (usernameInput, emailInput) => {
    setUsername(usernameInput)
    setUserEmail(emailInput)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setUsername('')
    setUserEmail('')
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        
        {/* Home Route - Dapat diakses dengan atau tanpa login */}
        <Route 
          path="/" 
          element={
            <App 
              userEmail={isAuthenticated ? username : ''} 
              onLogout={handleLogout}
              isAuthenticated={isAuthenticated}
            />
          } 
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
)

