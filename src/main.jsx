import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx'

function MainApp() {
  const [username, setUsername] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [currentPage, setCurrentPage] = useState('home') // 'home' or 'login'

  const handleLogin = (usernameInput, emailInput) => {
    setUsername(usernameInput)
    setUserEmail(emailInput)
    setCurrentPage('home') // Kembali ke home setelah login
  }

  const handleLogout = () => {
    setUsername('')
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
          userEmail={username} 
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
