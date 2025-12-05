import { useNavigate, Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

/**
 * Root layout aplikasi yang membungkus halaman dengan `Navbar` dan `Footer`.
 *
 * @param {{userEmail:string, supabaseUserId?:string|null, onLogout:function, isAuthenticated:boolean}} props
 * @returns {JSX.Element} Komponen layout utama.
 *
 * Komponen ini adalah layout root yang digunakan di seluruh aplikasi. Ia menerima
 * beberapa prop untuk menampilkan informasi pengguna di `Navbar` dan meneruskan
 * context ke rute anak menggunakan `Outlet`.
 */
function App({ userEmail, supabaseUserId, onLogout, isAuthenticated }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
  }

  const handleOpenLogin = () => {
    navigate('/login')
  }

  return (
    <div className="app">
      <Navbar 
        userEmail={userEmail} 
        onLogout={isAuthenticated ? handleLogout : null}
        isAuthenticated={isAuthenticated}
        onOpenLogin={handleOpenLogin}
      />
      
      <main className="content">
        <Outlet context={{ userEmail, supabaseUserId, onOpenLogin: handleOpenLogin, isAuthenticated }} />
      </main>

      <Footer />
    </div>
  )
}

export default App