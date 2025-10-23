import { useState } from 'react'
import './App.css'
import nasiGorengImg from './assets/pngtree-simple-thai-fried-rice-with-egg-for-busy-weeknights-delicious-a-png-image_16285503.png'

function App({ userEmail, onLogout, onOpenLogin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="app">
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h1 className="brand-logo">PiringSehat</h1>
          </div>

          {/* Hamburger Button */}
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          
          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <ul className="menu-list">
              <li className="navbar-item">
                <a href="#home" className="navbar-link active" onClick={closeMenu}>Home</a>
              </li>
              <li className="navbar-item">
                <a href="#services" className="navbar-link" onClick={closeMenu}>BMI</a>
              </li>
              <li className="navbar-item">
                <a href="#hitungkalori" className="navbar-link" onClick={closeMenu}>Pencarian</a>
              </li>
              <li className="navbar-item">
                <a href="#resep" className="navbar-link" onClick={closeMenu}>Hitung Kalori</a>
              </li>
              <li className="navbar-item">
                <a href="#tentang" className="navbar-link" onClick={closeMenu}>Tentang Kami</a>
              </li>
            </ul>

            {/* User Info Mobile - hanya muncul jika sudah login */}
            {userEmail ? (
              <div className="user-info-mobile">
                <span className="user-email">{userEmail}</span>
                <button onClick={onLogout} className="logout-button">
                  Keluar
                </button>
              </div>
            ) : (
              <div className="login-btn-mobile">
                <button onClick={() => { closeMenu(); onOpenLogin(); }} className="navbar-login-btn">
                  Masuk
                </button>
              </div>
            )}
          </div>

          {/* User Info Desktop / Login Button */}
          {userEmail ? (
            <div className="user-info-desktop">
              <span className="user-email">{userEmail}</span>
              <button onClick={onLogout} className="logout-button">
                Keluar
              </button>
            </div>
          ) : (
            <button onClick={onOpenLogin} className="navbar-login-btn">
              Masuk
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="content">
        <section className="welcome">
          <div className="welcome-content">
            <div className="welcome-text">
              <h2>Selamat Datang!</h2>
              <p>
                Website ini membantu Anda memahami pola makan sehat dan seimbang
                untuk hidup lebih berkualitas.
              </p>
              <p className="welcome-desc">
                Mulai perjalanan Anda menuju gaya hidup sehat dengan panduan nutrisi 
                yang tepat. Piring sehat adalah kunci untuk tubuh yang bugar dan energik!
              </p>
            </div>
            <div className="welcome-image">
              <img src={nasiGorengImg} alt="Nasi Goreng Sehat" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Piring Sehat. Hidup Sehat Dimulai dari Piring Anda.</p>
      </footer>
    </div>
  )
}

export default App
