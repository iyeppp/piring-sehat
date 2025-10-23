import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'

function MainApp() {
  const [userEmail, setUserEmail] = useState('')
  const [showLogin, setShowLogin] = useState(false)

  const handleLogin = (email) => {
    setUserEmail(email)
    setShowLogin(false)
  }

  const handleLogout = () => {
    setUserEmail('')
  }

  const openLogin = () => {
    setShowLogin(true)
  }

  const closeLogin = () => {
    setShowLogin(false)
  }

  return (
    <>
      <App 
        userEmail={userEmail} 
        onLogout={handleLogout}
        onOpenLogin={openLogin}
      />
      {showLogin && (
        <Login onLogin={handleLogin} onClose={closeLogin} />
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
)
