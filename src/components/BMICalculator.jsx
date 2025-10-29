import { useState } from 'react'
import './BMICalculator.css'

function BMICalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [gender, setGender] = useState('male')
  const [bmi, setBmi] = useState(null)
  const [category, setCategory] = useState('')
  const [weightRecommendation, setWeightRecommendation] = useState('')

  const calculateBMI = (e) => {
    e.preventDefault()
    
    if (weight && height) {
      const heightInMeters = height / 100
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1)
      setBmi(bmiValue)
      
      // Calculate weight recommendation
      let recommendation = ''
      const currentWeight = parseFloat(weight)
      
      // Determine category and recommendation
      if (bmiValue < 18.5) {
        setCategory('Kurus')
        // Calculate weight needed to reach BMI 18.5 (lower bound of normal)
        const targetWeight = 18.5 * (heightInMeters * heightInMeters)
        const weightNeeded = (targetWeight - currentWeight).toFixed(1)
        recommendation = `Anda membutuhkan ${weightNeeded} kg lagi untuk mencapai kategori ideal (BMI 18.5).`
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setCategory('Normal')
        recommendation = ''
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setCategory('Gemuk')
        // Calculate weight needed to lose to reach BMI 24.9 (upper bound of normal)
        const targetWeight = 24.9 * (heightInMeters * heightInMeters)
        const weightToLose = (currentWeight - targetWeight).toFixed(1)
        recommendation = `Anda perlu diet ${weightToLose} kg untuk mencapai kategori ideal (BMI 24.9).`
      } else {
        setCategory('Obesitas')
        // Calculate weight needed to lose to reach BMI 24.9
        const targetWeight = 24.9 * (heightInMeters * heightInMeters)
        const weightToLose = (currentWeight - targetWeight).toFixed(1)
        recommendation = `Anda perlu diet ${weightToLose} kg untuk mencapai kategori ideal (BMI 24.9).`
      }
      
      setWeightRecommendation(recommendation)
    }
  }

  const resetCalculator = () => {
    setWeight('')
    setHeight('')
    setGender('male')
    setBmi(null)
    setCategory('')
    setWeightRecommendation('')
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

          <div className="form-group">
            <label>Jenis Kelamin</label>
            <div className="gender-options">
              <label className="gender-label">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={(e) => setGender(e.target.value)}
                />
                Laki-laki
              </label>
              <label className="gender-label">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={(e) => setGender(e.target.value)}
                />
                Perempuan
              </label>
            </div>
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
            {weightRecommendation && (
              <div className="weight-recommendation">
                {weightRecommendation}
              </div>
            )}
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
