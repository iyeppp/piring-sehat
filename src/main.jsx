import { StrictMode, useState, useEffect } from "react";
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
import TestimoniSection from "./components/sections/TestimoniSection";
import BMICalculator from "./components/sections/BMICalculator";
import GeneticHeightCalculator from "./components/sections/GeneticHeightCalculator";
import ProteinCalculator from "./components/sections/ProteinCalculator";
import CariMakanan from "./components/sections/CariMakanan";
import HitungKalori from "./components/sections/HitungKalori";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { syncFirebaseUserToSupabase } from "./services/userService";

function MainApp() {
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [supabaseUserId, setSupabaseUserId] = useState(null);

  const handleLogin = (usernameInput, emailInput, userId) => {
    setUsername(usernameInput);
    setUserEmail(emailInput);
    setSupabaseUserId(userId || null);
    setIsAuthenticated(true);
  };

  const handleRegister = (usernameInput, emailInput, userId) => {
    setUsername(usernameInput);
    setUserEmail(emailInput);
    setSupabaseUserId(userId || null);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // sign out from Firebase to clear persisted session
    signOut(auth).catch(() => {/* ignore */})
    setUsername("");
    setUserEmail("");
    setSupabaseUserId(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const getUsername = (user) => {
      if (!user) return "";
      if (user.displayName) return user.displayName;
      if (user.email) return user.email.split("@")[0];
      if (user.reloadUserInfo?.screenName) return user.reloadUserInfo.screenName;
      if (user.providerData && user.providerData[0]?.uid) return `user_${user.providerData[0].uid}`;
      return "";
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let userId = null;
        try {
          userId = await syncFirebaseUserToSupabase(user);
        } catch (_) {
          // ignore sync error for restoring session
        }
        setUsername(getUsername(user));
        setUserEmail(user.email || "");
        setSupabaseUserId(userId);
        setIsAuthenticated(true);
      } else {
        setUsername("");
        setUserEmail("");
        setSupabaseUserId(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
              supabaseUserId={supabaseUserId}
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
                <TestimoniSection />
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
