import './WelcomeSection.css'
import nasiGorengImg from '../assets/pngtree-simple-thai-fried-rice-with-egg-for-busy-weeknights-delicious-a-png-image_16285503.png'

function WelcomeSection() {
  return (
    <section className="welcome">
      <div className="welcome-content">
        <div className="welcome-text">
          <h2>Selamat Datang!</h2>
          <p>
            Website ini membantu Anda memahami pola makan sehat dan seimbang
            untuk hidup lebih berkualitas.
          </p>
          <p className="welcome-desc">
            Mulai perjalanan Anda menuju gaya hidup sehat dengan panduan nutrisi 
            yang tepat. Piring sehat adalah kunci untuk tubuh yang bugar dan energik!
          </p>
        </div>
        <div className="welcome-image">
          <img src={nasiGorengImg} alt="Nasi Goreng Sehat" />
        </div>
      </div>
    </section>
  )
}

export default WelcomeSection
