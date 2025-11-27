import { supabase } from '../supabaseClient'

export async function syncFirebaseUserToSupabase(firebaseUser) {
  if (!firebaseUser) throw new Error('firebaseUser is required')

  const firebase_uid = firebaseUser.uid
  const email = firebaseUser.email
  const username = firebaseUser.displayName || (email ? email.split('@')[0] : null)

  // Cek apakah user sudah ada
  const { data: existing, error: selectError } = await supabase
    .from('users')
    .select('id')
    .eq('firebase_uid', firebase_uid)
    .maybeSingle()

  if (selectError) {
    console.error('Gagal cek user di Supabase:', selectError)
    throw selectError
  }

  if (existing) {
    return existing.id
  }

  // Jika belum ada, insert baru
  const { data, error: insertError } = await supabase
    .from('users')
    .insert({
      firebase_uid,
      email,
      username,
    })
    .select('id')
    .single()

  if (insertError) {
    console.error('Gagal insert user ke Supabase:', insertError)
    throw insertError
  }

  return data.id
}
