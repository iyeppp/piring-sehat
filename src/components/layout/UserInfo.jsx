/**
 * UserInfo Component
 *
 * Menampilkan email user yang sedang login dan tombol logout.
 * Dapat ditampilkan versi mobile dan desktop.
 *
 * @component
 * @param {Object} props
 * @param {string|null} props.userEmail - Email pengguna
 * @param {function} props.onLogout - Fungsi logout
 * @param {boolean} [props.isMobile=false] - Mode tampilan mobile
 * @returns {JSX.Element|null}
 */

import './UserInfo.css'

function UserInfo({ userEmail, onLogout, isMobile = false }) {
  if (!userEmail) return null

  const className = isMobile ? 'user-info-mobile' : 'user-info-desktop'

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      onLogout()
    }
  }

  return (
    <div className={className}>
      <span className="user-email">{userEmail}</span>
      <button onClick={handleLogout} className="logout-button">
        Keluar
      </button>
    </div>
  )
}

export default UserInfo