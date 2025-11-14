import './NavMenu.css'
import UserInfo from './UserInfo'

function NavMenu({ isOpen, onClose, userEmail, onLogout, onOpenLogin, activeSection, isAuthenticated }) {
  const menuItems = [
    { href: '#home', label: 'Home', id: 'home' },
    { href: '#bmi', label: 'BMI', id: 'bmi' },
    { href: '#cari', label: 'Cari Makanan', id: 'cari' },
    { href: '#hitung', label: 'Hitung Kalori', id: 'hitung' },
  ]

  return (
    <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.href} className="navbar-item">
            <a 
              href={item.href} 
              className={`navbar-link ${activeSection === item.id ? 'active' : ''}`} 
              onClick={onClose}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      {/* User Info Mobile - hanya muncul jika sudah login */}
      {isAuthenticated && userEmail ? (
        <UserInfo userEmail={userEmail} onLogout={onLogout} isMobile={true} />
      ) : (
        <div className="login-btn-mobile">
          <button 
            onClick={() => { 
              onClose(); 
              onOpenLogin(); 
            }} 
            className="navbar-login-btn"
          >
            Masuk
          </button>
        </div>
      )}
    </div>
  )
}

export default NavMenu
