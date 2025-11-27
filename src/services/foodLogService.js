import { supabase } from '../supabaseClient'

// Tambah satu catatan makanan ke tabel food_logs
export async function addFoodLog({ userId, date, foodName, calories, portion = 1, mealType = null, note = null, foodId = null }) {
  if (!userId) throw new Error('userId is required')
  if (!date) throw new Error('date is required')
  if (!foodName && !foodId) throw new Error('foodName or foodId is required')
  if (!calories) throw new Error('calories is required')

  const payload = {
    user_id: userId,
    date,
    calories,
    portion,
    meal_type: mealType,
    note,
    food_name_custom: foodName,
  }

  if (foodId) {
    payload.food_id = foodId
  }

  const { data, error } = await supabase
    .from('food_logs')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    console.error('Gagal menambah food_log:', error)
    throw error
  }

  return data
}

// Ambil semua catatan untuk 1 user pada 1 tanggal (YYYY-MM-DD)
export async function getFoodLogsByDate(userId, date) {
  if (!userId) throw new Error('userId is required')
  if (!date) throw new Error('date is required')

  const { data, error } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('logged_at', { ascending: true })

  if (error) {
    console.error('Gagal mengambil food_logs per tanggal:', error)
    throw error
  }

  return data || []
}

// Hitung total kalori untuk 1 user dalam rentang tanggal tertentu (misal 1 bulan)
export async function getTotalCaloriesInRange(userId, startDate, endDate) {
  if (!userId) throw new Error('userId is required')
  if (!startDate || !endDate) throw new Error('startDate and endDate are required')

  const { data, error } = await supabase
    .from('food_logs')
    .select('calories')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)

  if (error) {
    console.error('Gagal mengambil total kalori rentang tanggal:', error)
    throw error
  }

  const total = (data || []).reduce((sum, row) => sum + Number(row.calories || 0), 0)
  return total
}

// Hapus satu catatan food_log berdasarkan id
export async function deleteFoodLog(id) {
  if (!id) throw new Error('id is required')

  const { error } = await supabase
    .from('food_logs')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Gagal menghapus food_log:', error)
    throw error
  }
}

// Ringkasan nutrisi (protein, karbo, lemak) per hari untuk 1 user
// Menggunakan data nutrisi dari tabel makanan melalui relasi food_id -> makanan.id
export async function getDailyNutritionSummary(userId, date) {
  if (!userId) throw new Error('userId is required')
  if (!date) throw new Error('date is required')

  // Ambil semua log hari itu beserta data makanan terkait (jika ada)
  const { data, error } = await supabase
    .from('food_logs')
    .select(
      `id, portion, food_id,
       makanan:food_id (proteins, fat, carbohydrate)`
    )
    .eq('user_id', userId)
    .eq('date', date)

  if (error) {
    console.error('Gagal mengambil ringkasan nutrisi harian:', error)
    throw error
  }

  const initial = { protein: 0, carbs: 0, fat: 0 }

  const totals = (data || []).reduce((acc, row) => {
    const portion = Number(row.portion || 1)
    const food = row.makanan

    if (!food) return acc

    const proteins = Number(food.proteins || 0)
    const fat = Number(food.fat || 0)
    const carbs = Number(food.carbohydrate || 0)

    return {
      protein: acc.protein + portion * proteins,
      carbs: acc.carbs + portion * carbs,
      fat: acc.fat + portion * fat,
    }
  }, initial)

  return totals
}
