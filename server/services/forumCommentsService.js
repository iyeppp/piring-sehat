import { supabase } from '../supabaseClient.js'

// Service untuk operasi komentar di forum

export async function getCommentsByForumId(forumId) {
  const { data, error } = await supabase
    .from('view_forum_comments')
    .select('*')
    .eq('forum_id', forumId)
    .order('comment_created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createComment({ forumId, userId, content, parentCommentId = null }) {
  const { data, error } = await supabase
    .from('forum_comments')
    .insert({
      forum_id: forumId,
      user_id: userId,
      content,
      parent_comment_id: parentCommentId,
    })
    .select('*')
    .single()

  if (error) throw error
  return data
}

async function getCommentWithOwner(commentId) {
  const { data, error } = await supabase
    .from('forum_comments')
    .select('id, user_id')
    .eq('id', commentId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function updateComment({ commentId, requesterId, requesterRole, content }) {
  const comment = await getCommentWithOwner(commentId)

  if (!comment) {
    const err = new Error('Komentar tidak ditemukan')
    err.statusCode = 404
    throw err
  }

  const isOwner = comment.user_id === requesterId
  const isAdmin = requesterRole === 'admin'

  if (!isOwner && !isAdmin) {
    const err = new Error('Tidak memiliki izin untuk mengedit komentar ini')
    err.statusCode = 403
    throw err
  }

  const { data, error } = await supabase
    .from('forum_comments')
    .update({ content })
    .eq('id', commentId)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function deleteComment({ commentId, requesterId, requesterRole }) {
  const comment = await getCommentWithOwner(commentId)

  if (!comment) {
    const err = new Error('Komentar tidak ditemukan')
    err.statusCode = 404
    throw err
  }

  const isOwner = comment.user_id === requesterId
  const isAdmin = requesterRole === 'admin'

  if (!isOwner && !isAdmin) {
    const err = new Error('Tidak memiliki izin untuk menghapus komentar ini')
    err.statusCode = 403
    throw err
  }

  const { error } = await supabase
    .from('forum_comments')
    .delete()
    .eq('id', commentId)

  if (error) throw error
}
