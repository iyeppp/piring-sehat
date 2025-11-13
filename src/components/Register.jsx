import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Register.css'

function Register({ onRegister }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!username || !email || !password || !confirmPassword) {
      setError('Semua field harus diisi!')
      setSuccess('')
      return
    }

    if (username.length < 3) {
      setError('Username minimal 3 karakter!')
      setSuccess('')
      return
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter!')
      setSuccess('')
      return
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok!')
      setSuccess('')
      return
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid!')
      setSuccess('')
      return
    }

    setError('')
    setSuccess('Akun berhasil dibuat! Silakan login.')
    
    // Clear form
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    
    // Panggil callback dan redirect
    setTimeout(() => {
      onRegister(username, email)
      navigate('/login')
    }, 1500)
  }

  const handleGoToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>PiringSehat</h1>
          <p>Buat akun baru Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Pilih username"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password (min 6 karakter)"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi password"
              className="form-input"
            />
          </div>

          <button type="submit" className="register-button">
            Daftar
          </button>

          <div className="form-footer">
            <span>Sudah punya akun?</span>
            <button type="button" onClick={handleGoToLogin} className="link-button">
              Masuk di sini
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
