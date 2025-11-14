import { useState } from 'react'
import './CariMakanan.css'

function CariMakanan() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // Search functionality will be implemented when database is ready
  }

  return (
    <section id="cari" className="cari-section">
      <div className="cari-container">
        <h2 className="cari-title">Cari Makanan</h2>
        <p className="cari-description">
          Cari informasi nutrisi dari berbagai jenis makanan
        </p>

        <form onSubmit={handleSearch} className="search-form">
          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari Makanan"
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CariMakanan
