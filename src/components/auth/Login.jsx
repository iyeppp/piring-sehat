import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!usernameOrEmail || !password) {
      setError('Username/Email dan password harus diisi!')
      return
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter!')
      return
    }

    setError('')
    onLogin(usernameOrEmail, usernameOrEmail)
    navigate('/')
  }

  const handleForgotPassword = () => {
    alert('Fitur lupa password akan segera hadir!')
  }

  const handleGoToRegister = () => {
    navigate('/register')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>PiringSehat</h1>
          <p>Masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Username atau Email</label>
            <input
              type="text"
              id="usernameOrEmail"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="Masukkan username atau email"
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

          <div className="form-footer">
            <button type="button" onClick={handleForgotPassword} className="link-button">
              Lupa Password?
            </button>
            <span className="separator">•</span>
            <button type="button" onClick={handleGoToRegister} className="link-button">
              Daftar Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login