import { useState } from 'react'
import './BMICalculator.css'

function BMICalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bmi, setBmi] = useState(null)
  const [category, setCategory] = useState('')

  const calculateBMI = (e) => {
    e.preventDefault()
    
    if (weight && height) {
      const heightInMeters = height / 100
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1)
      setBmi(bmiValue)
      
      // Determine category
      if (bmiValue < 18.5) {
        setCategory('Kurus')
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setCategory('Normal')
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setCategory('Gemuk')
      } else {
        setCategory('Obesitas')
      }
    }
  }

  const resetCalculator = () => {
    setWeight('')
    setHeight('')
    setBmi(null)
    setCategory('')
  }

  return (
    <section id="bmi" className="bmi-section">
      <div className="bmi-container">
        <h2 className="bmi-title">Kalkulator BMI</h2>
        <p className="bmi-description">
          Hitung Body Mass Index (BMI) Anda untuk mengetahui kategori berat badan Anda
        </p>

        <form onSubmit={calculateBMI} className="bmi-form">
          <div className="form-group">
            <label htmlFor="weight">Berat Badan (kg)</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Masukkan berat badan"
              min="1"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="height">Tinggi Badan (cm)</label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Masukkan tinggi badan"
              min="1"
              step="0.1"
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-calculate">
              Hitung BMI
            </button>
            <button type="button" onClick={resetCalculator} className="btn-reset">
              Reset
            </button>
          </div>
        </form>

        {bmi && (
          <div className="bmi-result">
            <h3>Hasil BMI Anda</h3>
            <div className="bmi-value">{bmi}</div>
            <div className={`bmi-category ${category.toLowerCase()}`}>
              {category}
            </div>
            <div className="bmi-info">
              <h4>Kategori BMI:</h4>
              <ul>
                <li>Kurus: BMI &lt; 18.5</li>
                <li>Normal: BMI 18.5 - 24.9</li>
                <li>Gemuk: BMI 25 - 29.9</li>
                <li>Obesitas: BMI ≥ 30</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default BMICalculator
