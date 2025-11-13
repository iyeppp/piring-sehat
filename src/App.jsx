import { useNavigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import WelcomeSection from './components/WelcomeSection'
import BMICalculator from './components/BMICalculator'
import CariMakanan from './components/CariMakanan'
import HitungKalori from './components/HitungKalori'
import TentangKami from './components/TentangKami'
import Footer from './components/Footer'

function App({ userEmail, onLogout, isAuthenticated }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
  }

  const handleOpenLogin = () => {
    navigate('/login')
  }

  return (
    <div className="app">
      <Navbar 
        userEmail={userEmail} 
        onLogout={isAuthenticated ? handleLogout : null}
        isAuthenticated={isAuthenticated}
        onOpenLogin={handleOpenLogin}
      />
      
      <main className="content">
        <WelcomeSection />
        <TentangKami />
        <BMICalculator />
        <CariMakanan />
        <HitungKalori userEmail={userEmail} onOpenLogin={handleOpenLogin} isAuthenticated={isAuthenticated} />
      </main>

      <Footer />
    </div>
  )
}

export default App
