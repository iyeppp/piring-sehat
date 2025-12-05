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

import { useState } from 'react'
import './UserInfo.css'

function UserInfo({ userEmail, onLogout, isMobile = false }) {
  if (!userEmail) return null

  const [showConfirm, setShowConfirm] = useState(false)
  const className = isMobile ? 'user-info-mobile' : 'user-info-desktop'

  const handleOpenConfirm = () => setShowConfirm(true)
  const handleCancel = () => setShowConfirm(false)
  const handleConfirm = () => {
    setShowConfirm(false)
    onLogout()
  }

  return (
    <>
      <div className={className}>
        <span className="user-email">{userEmail}</span>
        <button onClick={handleOpenConfirm} className="logout-button">
          Keluar
        </button>
      </div>

      {showConfirm && (
        <div className="logout-modal-backdrop">
          <div className="logout-modal">
            <h3 className="logout-modal-title">Keluar dari akun?</h3>

            <p className="logout-modal-text">
              Kamu akan keluar dari sesi saat ini. Kamu bisa masuk kembali kapan saja.
            </p>
            <div className="logout-modal-actions">
              <button
                type="button"
                className="logout-cancel-btn"
                onClick={handleCancel}
              >
                Batal
              </button>
              <button
                type="button"
                className="logout-confirm-btn"
                onClick={handleConfirm}
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UserInfo