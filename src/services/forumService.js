import { auth } from '../firebase'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

async function getAuthHeaders() {
  const user = auth.currentUser
  if (!user) return {}
  const token = await user.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

async function request(path, options = {}) {
  const authHeaders = await getAuthHeaders()
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers || {}),
    },
    ...options,
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

export async function getForums() {
  const body = await request('/api/forums')
  return body.data || []
}

export async function getForumById(id) {
  if (!id) throw new Error('id is required')
  const body = await request(`/api/forums/${encodeURIComponent(id)}`)
  return body.data
}

export async function createForum({ title, content }) {
  if (!title) throw new Error('title is required')
  if (!content) throw new Error('content is required')

  const body = await request('/api/forums', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  })

  return body.data
}

export async function updateForum(id, { title, content }) {
  if (!id) throw new Error('id is required')

  const body = await request(`/api/forums/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  })

  return body.data
}

export async function deleteForum(id) {
  if (!id) throw new Error('id is required')

  await request(`/api/forums/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

export async function getComments(forumId) {
  if (!forumId) throw new Error('forumId is required')
  const body = await request(`/api/forums/${encodeURIComponent(forumId)}/comments`)
  return body.data || []
}

export async function createComment(forumId, { content, parentCommentId = null }) {
  if (!forumId) throw new Error('forumId is required')
  if (!content) throw new Error('content is required')

  const body = await request(`/api/forums/${encodeURIComponent(forumId)}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content, parentCommentId }),
  })

  return body.data
}

export async function updateComment(id, { content }) {
  if (!id) throw new Error('id is required')
  if (!content) throw new Error('content is required')

  const body = await request(`/api/forums/comments/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  })

  return body.data
}

export async function deleteComment(id) {
  if (!id) throw new Error('id is required')

  await request(`/api/forums/comments/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}
