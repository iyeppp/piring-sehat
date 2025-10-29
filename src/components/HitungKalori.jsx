import { useState } from 'react'
import './HitungKalori.css'

function HitungKalori({ userEmail, onOpenLogin }) {
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [calorieEntries, setCalorieEntries] = useState([])

  const handleAddEntry = (e) => {
    e.preventDefault()
    
    if (foodName && calories) {
      const newEntry = {
        id: Date.now(),
        foodName,
        calories: parseFloat(calories),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
      
      setCalorieEntries([...calorieEntries, newEntry])
      setFoodName('')
      setCalories('')
    }
  }

  const handleDeleteEntry = (id) => {
    setCalorieEntries(calorieEntries.filter(entry => entry.id !== id))
  }

  const getTotalCalories = () => {
    return calorieEntries.reduce((total, entry) => total + entry.calories, 0)
  }

  // Locked state when not logged in
  if (!userEmail) {
    return (
      <section id="hitung" className="hitung-section">
        <div className="hitung-container">
          <h2 className="hitung-title">Hitung Kalori</h2>
          <p className="hitung-description">
            Catat asupan kalori harian Anda
          </p>

          <div className="locked-state">
            <div className="lock-icon">🔒</div>
            <h3 className="locked-title">Fitur Terkunci</h3>
            <p className="locked-description">
              Anda harus login terlebih dahulu untuk menggunakan fitur pencatatan kalori harian.
            </p>
            <button onClick={onOpenLogin} className="btn-login-prompt">
              Login Sekarang
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Active state when logged in
  return (
    <section id="hitung" className="hitung-section">
      <div className="hitung-container">
        <h2 className="hitung-title">Hitung Kalori</h2>
        <p className="hitung-description">
          Catat asupan kalori harian Anda
        </p>

        <div className="calorie-tracker">
          <div className="tracker-summary">
            <div className="summary-card">
              <span className="summary-label">Total Kalori Hari Ini</span>
              <span className="summary-value">{getTotalCalories()}</span>
              <span className="summary-unit">kkal</span>
            </div>
          </div>

          <form onSubmit={handleAddEntry} className="calorie-form">
            <h3 className="form-title">Tambah Makanan</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="foodName">Nama Makanan</label>
                <input
                  type="text"
                  id="foodName"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="Contoh: Nasi Goreng"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="calories">Kalori (kkal)</label>
                <input
                  type="number"
                  id="calories"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="Contoh: 300"
                  min="1"
                  step="1"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-add-entry">
              ➕ Tambah
            </button>
          </form>

          <div className="entries-section">
            <h3 className="entries-title">Riwayat Hari Ini</h3>
            {calorieEntries.length === 0 ? (
              <div className="empty-state">
                <p>Belum ada catatan makanan hari ini</p>
              </div>
            ) : (
              <div className="entries-list">
                {calorieEntries.map((entry) => (
                  <div key={entry.id} className="entry-item">
                    <div className="entry-info">
                      <span className="entry-name">{entry.foodName}</span>
                      <span className="entry-time">{entry.time}</span>
                    </div>
                    <div className="entry-actions">
                      <span className="entry-calories">{entry.calories} kkal</span>
                      <button 
                        onClick={() => handleDeleteEntry(entry.id)} 
                        className="btn-delete"
                        aria-label="Hapus"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HitungKalori
