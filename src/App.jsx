import './App.css'
import Navbar from './components/Navbar'
import WelcomeSection from './components/WelcomeSection'
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
      </main>

      <Footer />
    </div>
  )
}

export default App
