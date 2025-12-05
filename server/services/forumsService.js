import { supabase } from '../supabaseClient.js'

// Service untuk operasi terkait forum (thread)

export async function getAllForums() {
  const { data, error } = await supabase
    .from('view_forums')
    .select('*')
    .order('forum_created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getForumById(id) {
  const { data, error } = await supabase
    .from('view_forums')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createForum({ userId, title, content }) {
  const { data, error } = await supabase
    .from('forums')
    .insert({
      user_id: userId,
      title,
      content,
    })
    .select('*')
    .single()

  if (error) throw error
  return data
}

async function getForumOwnerAndRole(id) {
  const { data, error } = await supabase
    .from('forums')
    .select('id, user_id')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function updateForum({ forumId, requesterId, requesterRole, title, content }) {
  const forum = await getForumOwnerAndRole(forumId)

  if (!forum) {
    const err = new Error('Forum tidak ditemukan')
    err.statusCode = 404
    throw err
  }

  const isOwner = forum.user_id === requesterId
  const isAdmin = requesterRole === 'admin'

  if (!isOwner && !isAdmin) {
    const err = new Error('Tidak memiliki izin untuk mengedit forum ini')
    err.statusCode = 403
    throw err
  }

  const payload = {}
  if (title != null) payload.title = title
  if (content != null) payload.content = content

  const { data, error } = await supabase
    .from('forums')
    .update(payload)
    .eq('id', forumId)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function deleteForum({ forumId, requesterId, requesterRole }) {
  const forum = await getForumOwnerAndRole(forumId)

  if (!forum) {
    const err = new Error('Forum tidak ditemukan')
    err.statusCode = 404
    throw err
  }

  const isOwner = forum.user_id === requesterId
  const isAdmin = requesterRole === 'admin'

  if (!isOwner && !isAdmin) {
    const err = new Error('Tidak memiliki izin untuk menghapus forum ini')
    err.statusCode = 403
    throw err
  }

  const { error } = await supabase
    .from('forums')
    .delete()
    .eq('id', forumId)

  if (error) throw error
}
