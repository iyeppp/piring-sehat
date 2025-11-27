import { supabase } from '../supabaseClient'

// Cari makanan berdasarkan nama (menggunakan ILIKE, tidak case-sensitive)
export async function searchFoodsByName(query, limit = 5) {
  const normalized = (query || '').trim()
  if (!normalized) return []

  const firstWord = normalized.split(/\s+/)[0]

  console.log('searchFoodsByName called with:', normalized, 'firstWord:', firstWord)

  const { data, error } = await supabase
    .from('makanan')
    .select('*')
    .ilike('name', `%${firstWord}%`)
    .limit(limit)

  if (error) {
    console.error('Gagal mencari makanan:', error)
    throw error
  }

  console.log('searchFoodsByName result:', data)

  return data || []
}

// Ambil satu makanan dengan nama paling cocok (first match)
export async function getFirstFoodByName(query) {
  const results = await searchFoodsByName(query, 1)
  return results[0] || null
}
