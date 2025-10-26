import { useState } from 'react'
import './Login.css'

function Login({ onLogin, onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Email dan password harus diisi!')
      return
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter!')
      return
    }

    setError('')
    onLogin(email)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Back Button */}
        {onBack && (
          <button className="login-back-btn" onClick={onBack} aria-label="Kembali">
            ← Kembali
          </button>
        )}
        <div className="login-header">
          <h1>PiringSehat</h1>
          <p>Masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
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
              placeholder="Masukkan password"
              className="form-input"
            />
          </div>

          <button type="submit" className="login-button">
            Masuk
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
