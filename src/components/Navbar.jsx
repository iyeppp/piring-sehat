import { useState, useEffect } from 'react'
import './Navbar.css'
import HamburgerButton from './HamburgerButton'
import NavMenu from './NavMenu'
import UserInfo from './UserInfo'

function Navbar({ userEmail, onLogout, onOpenLogin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'bmi', 'cari', 'hitung', 'tentang']
      const scrollPosition = window.scrollY + 100 // offset for navbar height

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Call once on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
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
          <HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
          
          {/* Navigation Menu */}
          <NavMenu
            isOpen={isMenuOpen}
            onClose={closeMenu}
            userEmail={userEmail}
            onLogout={onLogout}
            onOpenLogin={onOpenLogin}
            activeSection={activeSection}
          />

          {/* User Info Desktop / Login Button */}
          {userEmail ? (
            <UserInfo userEmail={userEmail} onLogout={onLogout} isMobile={false} />
          ) : (
            <button onClick={onOpenLogin} className="navbar-login-btn">
              Masuk
            </button>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
