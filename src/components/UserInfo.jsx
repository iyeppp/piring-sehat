import './UserInfo.css'

function UserInfo({ userEmail, onLogout, isMobile = false }) {
  if (!userEmail) {
    return null
  }

  const className = isMobile ? 'user-info-mobile' : 'user-info-desktop'

  return (
    <div className={className}>
      <span className="user-email">{userEmail}</span>
      <button onClick={onLogout} className="logout-button">
        Keluar
      </button>
    </div>
  )
}

export default UserInfo
