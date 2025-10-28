import './HitungKalori.css'

function HitungKalori() {
  return (
    <section id="hitung" className="hitung-section">
      <div className="hitung-container">
        <h2 className="hitung-title">Hitung Kalori</h2>
        <p className="hitung-description">
          Hitung kebutuhan kalori harian Anda berdasarkan aktivitas
        </p>

        <div className="calculator-preview">
          <div className="preview-content">
            <h3 className="preview-title">Fitur Sedang Dikembangkan</h3>
            <p className="preview-description">
              Kalkulator kalori kami sedang dalam tahap pengembangan. 
              Fitur ini akan membantu Anda menghitung kebutuhan kalori harian berdasarkan:
            </p>
            <div className="status-badge">
              <span className="badge-icon">🚧</span>
              <span className="badge-text">Dalam Pengembangan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HitungKalori
