import './WelcomeSection.css'
import logo from '../../assets/new-logo.png'

function WelcomeSection() {
  return (
    <section id="home" className="welcome">
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
          <img src={logo} alt="PiringSehat Logo" className="logo-image" />
        </div>
      </div>
    </section>
  )
}

export default WelcomeSection
