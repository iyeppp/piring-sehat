import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'

function MainApp() {
  const [userEmail, setUserEmail] = useState('')
  const [currentPage, setCurrentPage] = useState('home') // 'home' or 'login'

  const handleLogin = (email) => {
    setUserEmail(email)
    setCurrentPage('home') // Kembali ke home setelah login
  }

  const handleLogout = () => {
    setUserEmail('')
  }

  const goToLogin = () => {
    setCurrentPage('login')
  }

  const goToHome = () => {
    setCurrentPage('home')
  }

  return (
    <>
      {currentPage === 'login' ? (
        <Login onLogin={handleLogin} onBack={goToHome} />
      ) : (
        <App 
          userEmail={userEmail} 
          onLogout={handleLogout}
          onOpenLogin={goToLogin}
        />
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
)
