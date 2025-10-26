import './NavMenu.css'
import UserInfo from './UserInfo'

function NavMenu({ isOpen, onClose, userEmail, onLogout, onOpenLogin }) {
  const menuItems = [
    { href: '#home', label: 'Home', isActive: true },
    { href: '#bmi', label: 'BMI', isActive: false },
    { href: '#cari', label: 'Cari Makanan', isActive: false },
    { href: '#hitung', label: 'Hitung Kalori', isActive: false },
    { href: '#tentang', label: 'Tentang Kami', isActive: false },
  ]

  return (
    <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.href} className="navbar-item">
            <a 
              href={item.href} 
              className={`navbar-link ${item.isActive ? 'active' : ''}`} 
              onClick={onClose}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      {/* User Info Mobile - hanya muncul jika sudah login */}
      {userEmail ? (
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
