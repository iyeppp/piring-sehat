import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { addFoodLog, getFoodLogsByDate, getTotalCaloriesInRange, deleteFoodLog, getDailyNutritionSummary } from '../../services/foodLogService'
import { getFirstFoodByName, searchFoodsByName } from '../../services/makananService'
import './HitungKalori.css'

function HitungKalori() {
  const { userEmail, supabaseUserId, onOpenLogin, isAuthenticated } = useOutletContext()
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [calorieEntriesByDate, setCalorieEntriesByDate] = useState({})
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [monthlyCalories, setMonthlyCalories] = useState(0)
  const [autoFood, setAutoFood] = useState(null)
  const [autoFillLoading, setAutoFillLoading] = useState(false)
  const [autoFillError, setAutoFillError] = useState('')
  const [foodSuggestions, setFoodSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [dailyNutrition, setDailyNutrition] = useState({ protein: 0, carbs: 0, fat: 0 })

  const handleAddEntry = async (e) => {
    e.preventDefault()
    
    if (!supabaseUserId) return

    if (foodName && calories) {
      const dateKey = selectedDate.toISOString().split('T')[0]

      try {
        const created = await addFoodLog({
          userId: supabaseUserId,
          date: dateKey,
          foodName,
          calories: parseFloat(calories),
          foodId: autoFood ? autoFood.id : null,
        })

        const newEntry = {
          id: created.id,
          foodName: created.food_name_custom || foodName,
          calories: parseFloat(created.calories),
          time: new Date(created.logged_at || new Date()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }

        setCalorieEntriesByDate((prev) => {
          const current = prev[dateKey] || []
          return {
            ...prev,
            [dateKey]: [...current, newEntry],
          }
        })
        setFoodName('')
        setCalories('')
        setAutoFood(null)
      } catch (error) {
        console.error('Gagal menambah catatan kalori:', error)
      }
    }
  }

  const handleDeleteEntry = async (id) => {
    const dateKey = selectedDate.toISOString().split('T')[0]

    try {
      await deleteFoodLog(id)

      setCalorieEntriesByDate((prev) => {
        const current = prev[dateKey] || []
        return {
          ...prev,
          [dateKey]: current.filter((entry) => entry.id !== id),
        }
      })
    } catch (error) {
      console.error('Gagal menghapus catatan kalori:', error)
    }
  }

  const getTotalCalories = () => {
    const dateKey = selectedDate.toISOString().split('T')[0]
    const entries = calorieEntriesByDate[dateKey] || []
    return entries.reduce((total, entry) => total + entry.calories, 0)
  }

  const getMonthlyCalories = () => {
    return monthlyCalories
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

  // Autocomplete: cari makanan saat user mengetik
  useEffect(() => {
    let active = true

    const loadSuggestions = async () => {
      const query = foodName.trim()
      if (!query) {
        setFoodSuggestions([])
        return
      }

      try {
        setSuggestionsLoading(true)
        const results = await searchFoodsByName(query, 5)
        if (!active) return
        setFoodSuggestions(results)
      } catch (error) {
        console.error('Gagal memuat saran makanan:', error)
        if (active) setFoodSuggestions([])
      } finally {
        if (active) setSuggestionsLoading(false)
      }
    }

    // debounce sederhana: tunggu 300ms setelah user berhenti mengetik
    const timeoutId = setTimeout(() => {
      loadSuggestions()
    }, 300)

    return () => {
      active = false
      clearTimeout(timeoutId)
    }
  }, [foodName])

  const handleSelectSuggestion = (food) => {
    setFoodName(food.name || '')
    if (food.calories != null) {
      setCalories(String(food.calories))
    }
    setAutoFood(food)
    setAutoFillError('')
    setFoodSuggestions([])
  }

  const handleAutoFillCalories = async () => {
    if (!foodName) return
    if (!supabaseUserId) return

    try {
      setAutoFillError('')
      setAutoFillLoading(true)

      const food = await getFirstFoodByName(foodName)

      if (!food) {
        setAutoFillError('Makanan tidak ditemukan di database.')
        setAutoFood(null)
        return
      }

      setAutoFood(food)
      if (food.calories != null) {
        setCalories(String(food.calories))
      }
    } catch (error) {
      console.error('Gagal mengisi otomatis dari database:', error)
      setAutoFillError('Terjadi kesalahan saat mengambil data makanan.')
    } finally {
      setAutoFillLoading(false)
    }
  }

  // Load entries for selected date from Supabase
  useEffect(() => {
    const loadEntries = async () => {
      if (!supabaseUserId) return

      const dateKey = selectedDate.toISOString().split('T')[0]

      try {
        const logs = await getFoodLogsByDate(supabaseUserId, dateKey)

        const entries = logs.map((log) => ({
          id: log.id,
          foodName: log.food_name_custom,
          calories: parseFloat(log.calories),
          time: new Date(log.logged_at || new Date()).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }))

        setCalorieEntriesByDate((prev) => ({
          ...prev,
          [dateKey]: entries,
        }))
      } catch (error) {
        console.error('Gagal memuat catatan kalori:', error)
      }
    }

    loadEntries()
  }, [selectedDate, supabaseUserId])

  // Load monthly total calories from Supabase
  useEffect(() => {
    const loadMonthlyTotal = async () => {
      if (!supabaseUserId) return

      const { year, month } = getMonthInfo(selectedDate)
      const startDate = new Date(year, month, 1).toISOString().split('T')[0]
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

      try {
        const total = await getTotalCaloriesInRange(supabaseUserId, startDate, endDate)
        setMonthlyCalories(total)
      } catch (error) {
        console.error('Gagal memuat total kalori bulanan:', error)
      }
    }

    loadMonthlyTotal()
  }, [selectedDate, supabaseUserId])

  // Load daily nutrition summary from Supabase
  useEffect(() => {
    const loadNutrition = async () => {
      if (!supabaseUserId) return

      const dateKey = selectedDate.toISOString().split('T')[0]

      try {
        const totals = await getDailyNutritionSummary(supabaseUserId, dateKey)
        setDailyNutrition(totals)
      } catch (error) {
        console.error('Gagal memuat ringkasan nutrisi harian:', error)
        setDailyNutrition({ protein: 0, carbs: 0, fat: 0 })
      }
    }

    loadNutrition()
  }, [selectedDate, supabaseUserId])

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
                <FontAwesomeIcon icon={byPrefixAndName.fas['angle-left']} />
              </button>
              <div className="calendar-title">
                {monthFormatter.format(currentMonth)}
              </div>
              <button
                type="button"
                className="calendar-nav-button"
                onClick={handleNextMonth}
              >
                <FontAwesomeIcon icon={byPrefixAndName.fas['angle-right']} />
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
              <div className="summary-card summary-card-nutrition">
                <span className="summary-label">Ringkasan Nutrisi Hari Ini</span>
                <span className="summary-unit">
                  Protein: {dailyNutrition.protein.toFixed(1)} g
                </span>
                <span className="summary-unit">
                  Karbohidrat: {dailyNutrition.carbs.toFixed(1)} g
                </span>
                <span className="summary-unit">
                  Lemak: {dailyNutrition.fat.toFixed(1)} g
                </span>
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
                  {foodSuggestions.length > 0 && (
                    <div className="food-suggestions">
                      {foodSuggestions.map((food) => (
                        <button
                          key={food.id}
                          type="button"
                          className="food-suggestion-item"
                          onClick={() => handleSelectSuggestion(food)}
                        >
                          <span className="food-suggestion-name">{food.name}</span>
                          {food.calories != null && (
                            <span className="food-suggestion-calories">{food.calories} kkal</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {autoFood && (
                    <p className="auto-fill-info">
                      Menggunakan data: {autoFood.name} ({autoFood.calories} kkal)
                    </p>
                  )}
                  {autoFillError && (
                    <p className="auto-fill-error">{autoFillError}</p>
                  )}
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
