import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import './HitungKalori.css'

function HitungKalori() {
  const { userEmail, onOpenLogin, isAuthenticated } = useOutletContext()
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [calorieEntriesByDate, setCalorieEntriesByDate] = useState({})
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleAddEntry = (e) => {
    e.preventDefault()
    
    if (foodName && calories) {
      const newEntry = {
        id: Date.now(),
        foodName,
        calories: parseFloat(calories),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
      
      const dateKey = selectedDate.toISOString().split('T')[0]

      setCalorieEntriesByDate((prev) => {
        const current = prev[dateKey] || []
        return {
          ...prev,
          [dateKey]: [...current, newEntry],
        }
      })
      setFoodName('')
      setCalories('')
    }
  }

  const handleDeleteEntry = (id) => {
    const dateKey = selectedDate.toISOString().split('T')[0]

    setCalorieEntriesByDate((prev) => {
      const current = prev[dateKey] || []
      return {
        ...prev,
        [dateKey]: current.filter((entry) => entry.id !== id),
      }
    })
  }

  const getTotalCalories = () => {
    const dateKey = selectedDate.toISOString().split('T')[0]
    const entries = calorieEntriesByDate[dateKey] || []
    return entries.reduce((total, entry) => total + entry.calories, 0)
  }

  const getMonthlyCalories = () => {
    const { year, month } = getMonthInfo(selectedDate)

    return Object.entries(calorieEntriesByDate).reduce((total, [dateKey, entries]) => {
      const date = new Date(dateKey)

      if (date.getFullYear() === year && date.getMonth() === month) {
        const dailyTotal = entries.reduce((daySum, entry) => daySum + entry.calories, 0)
        return total + dailyTotal
      }

      return total
    }, 0)
  }

  const getMonthInfo = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const startWeekday = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    return { year, month, startWeekday, daysInMonth }
  }

  const buildCalendarDays = () => {
    const { year, month, startWeekday, daysInMonth } = getMonthInfo(currentMonth)
    const days = []

    for (let i = 1; i < startWeekday; i += 1) {
      days.push(null)
    }

    for (let d = 1; d <= daysInMonth; d += 1) {
      days.push(new Date(year, month, d))
    }

    return days
  }

  const handlePrevMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const isSameDate = (a, b) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    )
  }

  const monthFormatter = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  })

  const weekdayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

  // Locked state when not logged in
  if (!isAuthenticated || !userEmail) {
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
        <div className="hitung-header">
          <h2 className="hitung-title">Hitung Kalori</h2>
          <p className="hitung-description">
            Catat asupan kalori harian Anda untuk tanggal yang dipilih di kalender.
          </p>
        </div>

        <div className="hitung-layout">
          <div className="calendar-container">
            <div className="calendar-header">
              <button
                type="button"
                className="calendar-nav-button"
                onClick={handlePrevMonth}
              >
                
              </button>
              <div className="calendar-title">
                {monthFormatter.format(currentMonth)}
              </div>
              <button
                type="button"
                className="calendar-nav-button"
                onClick={handleNextMonth}
              >
                
              </button>
            </div>

            <div className="calendar-grid">
              {weekdayNames.map((day) => (
                <div key={day} className="calendar-day-name">
                  {day}
                </div>
              ))}

              {buildCalendarDays().map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="calendar-cell empty" />
                }

                const isToday = isSameDate(date, new Date())
                const isSelected = isSameDate(date, selectedDate)

                const dateKey = date.toISOString().split('T')[0]
                const hasEntries = (calorieEntriesByDate[dateKey] || []).length > 0

                const classNames = [
                  'calendar-cell',
                  isToday ? 'today' : '',
                  isSelected ? 'selected' : '',
                  hasEntries ? 'has-entries' : '',
                ]
                  .filter(Boolean)
                  .join(' ')

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    className={classNames}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>
            <div className="tracker-summary tracker-summary-calendar">
              <div className="summary-card">
                <span className="summary-label">Total Kalori Hari Ini</span>
                <span className="summary-value">{getTotalCalories()}</span>
                <span className="summary-unit">kkal</span>
              </div>
              <div className="summary-card summary-card-monthly">
                <span className="summary-label">Total Kalori Bulan Ini</span>
                <span className="summary-value">{getMonthlyCalories()}</span>
                <span className="summary-unit">kkal</span>
              </div>
            </div>
          </div>

          <div className="calorie-tracker">
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
              <h3 className="entries-title">Riwayat untuk Tanggal Ini</h3>
              {(calorieEntriesByDate[selectedDate.toISOString().split('T')[0]] || []).length === 0 ? (
                <div className="empty-state">
                  <p>Belum ada catatan makanan untuk tanggal ini</p>
                </div>
              ) : (
                <div className="entries-list">
                  {(
                    calorieEntriesByDate[selectedDate.toISOString().split('T')[0]] || []
                  ).map((entry) => (
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
      </div>
    </section>
  )
}

export default HitungKalori
