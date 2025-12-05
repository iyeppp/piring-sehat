import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import './ForumSection.css'
import { getForumById, getComments, createComment, updateComment, deleteComment, updateForum } from '../../services/forumService'

function ForumDetailSection() {
  const { id } = useParams()
  const navigate = useNavigate()
  const context = useOutletContext()
  const { isAuthenticated, onOpenLogin, supabaseUserId, userRole } = context || {}

  const [forum, setForum] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [content, setContent] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [expandedComments, setExpandedComments] = useState({})
  const [showEditForum, setShowEditForum] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const formatDateTime = (value) => {
    if (!value) return ''
    try {
      return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      setLoading(true)
      setError('')
      try {
        const [forumData, commentData] = await Promise.all([
          getForumById(id),
          getComments(id),
        ])
        setForum(forumData)
        setComments(commentData)
      } catch (err) {
        setError(err.message || 'Gagal memuat forum')
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      loadData()
    }
  }, [id, isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      if (onOpenLogin) onOpenLogin()
      return
    }

    if (!content.trim()) return

    try {
      setLoading(true)
      setError('')
      if (editingCommentId) {
        const updated = await updateComment(editingCommentId, { content: content.trim() })
        setComments((prev) => prev.map((c) => (c.id === editingCommentId ? updated : c)))
      } else {
        const created = await createComment(id, { content: content.trim() })
        setComments((prev) => [...prev, created])
      }
      setContent('')
      setEditingCommentId(null)
    } catch (err) {
      setError(err.message || 'Gagal menambahkan komentar')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpandComment = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id)
    setContent(comment.content || '')
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Yakin ingin menghapus komentar ini?')) return

    try {
      await deleteComment(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      alert(err.message || 'Gagal menghapus komentar')
    }
  }

  // Hanya pembuat forum atau admin yang boleh mengedit forum
  const canEditForum = forum && (forum.user_id === supabaseUserId || userRole === 'admin')

  const openEditForum = () => {
    if (!forum) return
    setEditTitle(forum.title || '')
    setEditContent(forum.content || '')
    setShowEditForum(true)
  }

  const closeEditForum = () => {
    setShowEditForum(false)
  }

  const handleSaveForum = async (e) => {
    e.preventDefault()
    if (!forum) return
    if (!editTitle.trim() || !editContent.trim()) return

    try {
      setLoading(true)
      setError('')
      const updated = await updateForum(forum.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
      })
      setForum(updated)
      setShowEditForum(false)
    } catch (err) {
      setError(err.message || 'Gagal mengubah forum')
    } finally {
      setLoading(false)
    }
  }

  if (!id) {
    return null
  }

  return (
    <section className="forum-section">
      <div className="forum-container">
        <button
          type="button"
          className="forum-link-btn"
          onClick={() => navigate('/forum')}
        >
          Kembali ke forum
        </button>

        {loading && <p className="forum-loading">Memuat...</p>}
        {error && <p className="forum-alert forum-alert-error">{error}</p>}

        {forum && (
          <article className="forum-card forum-detail-card">
            <div className="forum-card-header">
              <div>
                <h2 className="forum-card-title">{forum.title}</h2>
                <span className="forum-card-meta">
                  oleh {forum.username || 'Pengguna'}
                  {forum.forum_created_at && (
                    <>
                      {' '}
                      <span>{formatDateTime(forum.forum_created_at)}</span>
                    </>
                  )}
                </span>
              </div>
              {canEditForum && (
                <button
                  type="button"
                  className="forum-edit-btn"
                  onClick={openEditForum}
                >
                  Edit Forum
                </button>
              )}
            </div>
            <p className="forum-card-content forum-detail-content" style={{ whiteSpace: 'pre-wrap' }}>
              {forum.content}
            </p>

            <div className="forum-comments">
              <h3 className="forum-comments-title">Diskusi</h3>
              {comments.length === 0 && !loading && (
                <p className="forum-empty">Belum ada komentar. Jadilah yang pertama berdiskusi.</p>
              )}

              {comments.map((comment) => (
                <div key={comment.id} className="forum-comment-item">
                  <div className="forum-comment-header">
                    <span className="forum-comment-line">
                      <span className="forum-comment-author">{comment.username || 'Pengguna'}</span>
                      {': '}
                      <span className="forum-comment-content-inline">
                        {expandedComments[comment.id]
                          ? comment.content
                          : (comment.content || '').length > 150
                            ? `${comment.content.slice(0, 150)}...`
                            : comment.content}
                      </span>
                    </span>
                    {comment.comment_created_at && (
                      <span className="forum-card-meta" style={{ marginLeft: '0.5rem' }}>
                        {formatDateTime(comment.comment_created_at)}
                      </span>
                    )}
                    {isAuthenticated && (comment.user_id === supabaseUserId || userRole === 'admin') && (
                      <div className="forum-comment-actions">
                        <button
                          type="button"
                          className="forum-comment-edit"
                          onClick={() => handleEditComment(comment)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="forum-comment-delete"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                  {(comment.content || '').length > 150 && (
                    <button
                      type="button"
                      className="forum-readmore-btn"
                      onClick={() => toggleExpandComment(comment.id)}
                    >
                      {expandedComments[comment.id] ? 'Sembunyikan' : 'Baca selengkapnya'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="forum-comments-form">
              <h3 className="forum-form-title">Tambahkan Komentar</h3>
              {!isAuthenticated && (
                <p className="forum-login-hint">
                  Kamu perlu login terlebih dahulu untuk berkomentar.
                </p>
              )}
              <form onSubmit={handleSubmit} className="forum-form">
                <textarea
                  placeholder="Tulis komentar kamu di sini..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="forum-textarea"
                  rows={3}
                />
                <button type="submit" className="forum-submit-btn" disabled={loading}>
                  {loading ? 'Mengirim...' : 'Kirim Komentar'}
                </button>
              </form>
            </div>
          </article>
        )}

        {showEditForum && (
          <div className="logout-modal-backdrop">
            <div className="logout-modal">
              <h3 className="logout-modal-title">Edit Forum</h3>
              <form onSubmit={handleSaveForum} className="forum-form">
                <input
                  type="text"
                  className="forum-input"
                  placeholder="Judul forum"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="forum-textarea"
                  rows={5}
                  placeholder="Isi forum"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="logout-modal-actions">
                  <button
                    type="button"
                    className="logout-cancel-btn"
                    onClick={closeEditForum}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="logout-confirm-btn"
                    disabled={loading}
                  >
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ForumDetailSection
