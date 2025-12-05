import express from 'express'
import {
  getAllForums,
  getForumById,
  createForum,
  updateForum,
  deleteForum,
} from '../services/forumsService.js'
import {
  getCommentsByForumId,
  createComment,
  updateComment,
  deleteComment,
} from '../services/forumCommentsService.js'

const router = express.Router()

// GET /api/forums
router.get('/', async (req, res) => {
  try {
    const forums = await getAllForums()
    res.json({ data: forums })
  } catch (error) {
    console.error('Error getAllForums:', error)
    res.status(500).json({ error: 'Gagal mengambil data forums' })
  }
})

// GET /api/forums/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: 'id wajib diisi' })
  }

  try {
    const forum = await getForumById(Number(id))
    if (!forum) {
      return res.status(404).json({ error: 'Forum tidak ditemukan' })
    }
    res.json({ data: forum })
  } catch (error) {
    console.error('Error getForumById:', error)
    res.status(500).json({ error: 'Gagal mengambil detail forum' })
  }
})

// POST /api/forums
router.post('/', async (req, res) => {
  const userId = req.user?.supabaseUserId
  const { title, content } = req.body

  if (!userId) {
    return res.status(401).json({ error: 'User tidak terautentikasi' })
  }

  if (!title || !content) {
    return res.status(400).json({ error: 'title dan content wajib diisi' })
  }

  try {
    const created = await createForum({ userId, title, content })
    res.status(201).json({ data: created })
  } catch (error) {
    console.error('Error createForum:', error)
    res.status(500).json({ error: 'Gagal membuat forum baru' })
  }
})

// PUT /api/forums/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { title, content } = req.body
  const requesterId = req.user?.supabaseUserId
  const requesterRole = req.user?.role

  if (!id) {
    return res.status(400).json({ error: 'id wajib diisi' })
  }

  if (!requesterId) {
    return res.status(401).json({ error: 'User tidak terautentikasi' })
  }

  try {
    const updated = await updateForum({
      forumId: Number(id),
      requesterId,
      requesterRole,
      title,
      content,
    })
    res.json({ data: updated })
  } catch (error) {
    console.error('Error updateForum:', error)
    const status = error.statusCode || 500
    res.status(status).json({ error: error.message || 'Gagal mengupdate forum' })
  }
})

// DELETE /api/forums/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const requesterId = req.user?.supabaseUserId
  const requesterRole = req.user?.role

  if (!id) {
    return res.status(400).json({ error: 'id wajib diisi' })
  }

  if (!requesterId) {
    return res.status(401).json({ error: 'User tidak terautentikasi' })
  }

  try {
    await deleteForum({
      forumId: Number(id),
      requesterId,
      requesterRole,
    })
    res.status(204).send()
  } catch (error) {
    console.error('Error deleteForum:', error)
    const status = error.statusCode || 500
    res.status(status).json({ error: error.message || 'Gagal menghapus forum' })
  }
})

// GET /api/forums/:forumId/comments
router.get('/:forumId/comments', async (req, res) => {
  const { forumId } = req.params

  if (!forumId) {
    return res.status(400).json({ error: 'forumId wajib diisi' })
  }

  try {
    const comments = await getCommentsByForumId(Number(forumId))
    res.json({ data: comments })
  } catch (error) {
    console.error('Error getCommentsByForumId:', error)
    res.status(500).json({ error: 'Gagal mengambil komentar forum' })
  }
})

// POST /api/forums/:forumId/comments
router.post('/:forumId/comments', async (req, res) => {
  const { forumId } = req.params
  const { content, parentCommentId } = req.body
  const userId = req.user?.supabaseUserId

  if (!forumId) {
    return res.status(400).json({ error: 'forumId wajib diisi' })
  }

  if (!userId) {
    return res.status(401).json({ error: 'User tidak terautentikasi' })
  }

  if (!content) {
    return res.status(400).json({ error: 'content wajib diisi' })
  }

  try {
    const created = await createComment({
      forumId: Number(forumId),
      userId,
      content,
      parentCommentId: parentCommentId ?? null,
    })
    res.status(201).json({ data: created })
  } catch (error) {
    console.error('Error createComment:', error)
    res.status(500).json({ error: 'Gagal menambahkan komentar' })
  }
})

// PUT /api/forums/comments/:id
router.put('/comments/:id', async (req, res) => {
  const { id } = req.params
  const { content } = req.body
  const requesterId = req.user?.supabaseUserId
  const requesterRole = req.user?.role

  if (!id) {
    return res.status(400).json({ error: 'id wajib diisi' })
  }

  if (!requesterId) {
    return res.status(401).json({ error: 'User tidak terautentikasi' })
  }

  if (!content) {
    return res.status(400).json({ error: 'content wajib diisi' })
  }

  try {
    const updated = await updateComment({
      commentId: Number(id),
      requesterId,
      requesterRole,
      content,
    })
    res.json({ data: updated })
  } catch (error) {
    console.error('Error updateComment:', error)
    const status = error.statusCode || 500
    res.status(status).json({ error: error.message || 'Gagal mengupdate komentar' })
  }
})

// DELETE /api/forums/comments/:id
router.delete('/comments/:id', async (req, res) => {
  const { id } = req.params
  const requesterId = req.user?.supabaseUserId
  const requesterRole = req.user?.role

  if (!id) {
    return res.status(400).json({ error: 'id wajib diisi' })
  }

  if (!requesterId) {
    return res.status(401).json({ error: 'User tidak terautentikasi' })
  }

  try {
    await deleteComment({
      commentId: Number(id),
      requesterId,
      requesterRole,
    })
    res.status(204).send()
  } catch (error) {
    console.error('Error deleteComment:', error)
    const status = error.statusCode || 500
    res.status(status).json({ error: error.message || 'Gagal menghapus komentar' })
  }
})

export default router
