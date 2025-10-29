import './App.css'
import Navbar from './components/Navbar'
import WelcomeSection from './components/WelcomeSection'
import BMICalculator from './components/BMICalculator'
import CariMakanan from './components/CariMakanan'
import HitungKalori from './components/HitungKalori'
import TentangKami from './components/TentangKami'
import Footer from './components/Footer'

function App({ userEmail, onLogout, onOpenLogin }) {
  return (
    <div className="app">
      <Navbar 
        userEmail={userEmail} 
        onLogout={onLogout} 
        onOpenLogin={onOpenLogin} 
      />
      
      <main className="content">
        <WelcomeSection />
        <TentangKami />
        <BMICalculator />
        <CariMakanan />
        <HitungKalori userEmail={userEmail} onOpenLogin={onOpenLogin} />
      </main>

      <Footer />
    </div>
  )
}

export default App
