import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import WelcomeSection from "./components/sections/WelcomeSection";
import TentangKami from "./components/sections/TentangKami";
import BMICalculator from "./components/sections/BMICalculator";
import GeneticHeightCalculator from "./components/sections/GeneticHeightCalculator";
import ProteinCalculator from "./components/sections/ProteinCalculator";
import CariMakanan from "./components/sections/CariMakanan";
import HitungKalori from "./components/sections/HitungKalori";

function MainApp() {
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (usernameInput, emailInput) => {
    setUsername(usernameInput);
    setUserEmail(emailInput);
    setIsAuthenticated(true);
  };

  const handleRegister = (usernameInput, emailInput) => {
    setUsername(usernameInput);
    setUserEmail(emailInput);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUsername("");
    setUserEmail("");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/register"
          element={<Register onRegister={handleRegister} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/"
          element={
            <App
              userEmail={isAuthenticated ? username : ""}
              onLogout={handleLogout}
              isAuthenticated={isAuthenticated}
            />
          }
        >
          <Route
            index
            element={
              <>
                <WelcomeSection />
                <TentangKami />
              </>
            }
          />
          <Route path="Kalkulator" element={<BMICalculator />} />
          <Route path="cari-makanan" element={<CariMakanan />} />
          <Route path="hitung-kalori" element={<HitungKalori />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);
