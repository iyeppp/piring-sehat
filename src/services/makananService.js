import { auth } from '../firebase'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

/**
 * Ambil header Authorization dari Firebase currentUser (Bearer token).
 * Jika tidak ada user yang login, mengembalikan objek kosong.
 * @returns {Promise<Object>} Header Authorization atau objek kosong.
 */
async function getAuthHeaders() {
  const user = auth.currentUser
  if (!user) return {}
  const token = await user.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

/**
 * Helper sederhana untuk melakukan GET request ke endpoint makanan.
 * Melakukan parsing JSON dan melempar Error jika response tidak OK.
 * @param {string} path Path endpoint (mis. '/api/foods/search').
 * @returns {Promise<any>} Body response yang ter-parse.
 */
async function request(path) {
  const authHeaders = await getAuthHeaders()
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      ...authHeaders,
    },
  })

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const body = isJson ? await res.json() : null

  if (!res.ok) {
    const message = body?.error || res.statusText || 'Request failed'
    throw new Error(message)
  }

  return body
}

/**
 * Cari daftar makanan berdasarkan nama (query), mengembalikan array hasil.
 * Jika `query` kosong, akan mengembalikan daftar default (limit jumlah).
 *
 * @param {string} query Kata kunci pencarian.
 * @param {number} [limit=300] Batas jumlah hasil.
 * @returns {Promise<Array>} Array objek makanan.
 *
 * Fungsi ini memanggil endpoint pencarian makanan pada backend dan
 * mengembalikan `body.data` atau array kosong jika tidak ada data.
 */
export async function searchFoodsByName(query, limit = 300) {
  const normalized = (query || '').trim()

  if (!normalized) {
    const body = await request(`/api/foods/search?limit=${encodeURIComponent(limit)}`)
    return body.data || []
  }

  const body = await request(
    `/api/foods/search?query=${encodeURIComponent(normalized)}&limit=${encodeURIComponent(limit)}`
  )

  return body.data || []
}

/**
 * Ambil makanan pertama yang cocok dengan query (untuk autofill).
 * @param {string} query Kata kunci pencarian.
 * @returns {Promise<Object|null>} Objek makanan atau null jika tidak ditemukan.
 */
export async function getFirstFoodByName(query) {
  const normalized = (query || '').trim()
  if (!normalized) return null

  const body = await request(`/api/foods/first?query=${encodeURIComponent(normalized)}`)
  return body.data || null
}