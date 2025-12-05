import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import './ForumSection.css'
import { getForums, createForum, updateForum, deleteForum } from '../../services/forumService'

function ForumSection() {
  const navigate = useNavigate()
  const context = useOutletContext()
  const { isAuthenticated, onOpenLogin, supabaseUserId, userRole } = context || {}
  const [forums, setForums] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingForumId, setEditingForumId] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3

  useEffect(() => {
    if (!isAuthenticated) return

    const loadForums = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getForums()
        setForums(data)
        setCurrentPage(0)
      } catch (err) {
        setError(err.message || 'Gagal memuat forum')
      } finally {
        setLoading(false)
      }
    }

    loadForums()
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    try {
      setLoading(true)
      setError('')
      const payload = {
        title: title.trim(),
        content: content.trim(),
      }

      if (editingForumId) {
        const updated = await updateForum(editingForumId, payload)
        setForums((prev) => prev.map((f) => (f.id === editingForumId ? updated : f)))
      } else {
        const created = await createForum(payload)
        setForums((prev) => [created, ...prev])
      }
      setTitle('')
      setContent('')
      setEditingForumId(null)
      setCurrentPage(0)
    } catch (err) {
      setError(err.message || 'Gagal membuat forum baru')
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(forums.length / itemsPerPage))
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentForums = forums.slice(startIndex, endIndex)
  const showPagination = forums.length > itemsPerPage

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

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

  const handleEdit = (forum) => {
    if (!forum) return
    setEditingForumId(forum.id)
    setTitle(forum.title || '')
    setContent(forum.content || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus forum ini?')) return

    try {
      await deleteForum(id)
      setForums((prev) => prev.filter((f) => f.id !== id))
    } catch (err) {
      alert(err.message || 'Gagal menghapus forum')
    }
  }

  return (
    <section className="forum-section">
      <div className="forum-container">
        {isAuthenticated ? (
          <div className="forum-main-card">
            <header className="forum-header-inside">
              <h2 className="forum-title">Forum Diskusi</h2>
              <p className="forum-subtitle">
                Tempat kamu berbagi pengalaman, tips, dan pertanyaan seputar pola makan sehat.
              </p>
            </header>

            <div className="forum-list">
              {forums.length === 0 && !loading && (
                <p className="forum-empty">Belum ada forum. Jadilah yang pertama membuat topik!</p>
              )}

              {loading && <p className="forum-loading">Memuat...</p>}

              {currentForums.map((forum) => (
                <article key={forum.id} className="forum-card forum-card-compact">
                  <div className="forum-card-header">
                    <h3
                      className="forum-card-title"
                      onClick={() => navigate(`/forum/${forum.id}`)}
                    >
                      {forum.title}
                    </h3>
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
                  <p className="forum-card-content">
                    {forum.content?.slice(0, 120)}
                    {forum.content && forum.content.length > 120 ? '...' : ''}
                  </p>
                  <div className="forum-card-footer">
                    <button
                      type="button"
                      className="forum-link-btn"
                      onClick={() => navigate(`/forum/${forum.id}`)}
                    >
                      Lihat diskusi ({forum.comment_count ?? 0} komentar)
                    </button>
                    {forum.is_locked && <span className="forum-badge">Terkunci</span>}
                    {(forum.user_id === supabaseUserId || userRole === 'admin') && (
                      <div className="forum-footer-actions">
                        <button
                          type="button"
                          className="forum-edit-btn"
                          onClick={() => handleEdit(forum)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="forum-delete-btn"
                          onClick={() => handleDelete(forum.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}

              {showPagination && (
                <div className="forum-pagination">
                  <button
                    type="button"
                    className="forum-page-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                  >
                    ← Sebelumnya
                  </button>
                  <span className="forum-page-indicator">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    type="button"
                    className="forum-page-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                  >
                    Berikutnya →
                  </button>
                </div>
              )}
            </div>

            <div className="forum-divider" />

            <div className="forum-form-wrapper">
              <h3 className="forum-form-title">Buat Topik Baru</h3>
              <form onSubmit={handleSubmit} className="forum-form">
                <input
                  type="text"
                  placeholder="Judul forum"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="forum-input"
                />
                <textarea
                  placeholder="Tulis isi forum di sini..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="forum-textarea"
                  rows={4}
                />
                {error && <div className="forum-alert forum-alert-error">{error}</div>}
                <button type="submit" className="forum-submit-btn" disabled={loading}>
                  {loading ? 'Mengirim...' : editingForumId ? 'Simpan Perubahan' : 'Kirim Forum'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="forum-form-card">
            <header className="forum-header-inside">
              <h2 className="forum-title">Forum Diskusi</h2>
              <p className="forum-subtitle">
                Tempat kamu berbagi pengalaman, tips, dan pertanyaan seputar pola makan sehat.
              </p>
            </header>
            <h3 className="forum-form-title">Masuk untuk Mengakses Forum</h3>
            <p className="forum-login-hint">
              Kamu perlu login terlebih dahulu untuk membuat dan melihat diskusi di forum.
            </p>
            <button
              type="button"
              className="forum-login-btn"
              onClick={onOpenLogin}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ForumSection
