import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import MainNavigation from "./components/MainNavigation";
import PatientDashboard from "./components/PatientDashboard";
import CalendarPage from "./pages/CalendarPage";
import ServicesPage from "./pages/ServicesPage";
import SearchPage from "./pages/SearchPage";
import "./components/MainNavigation.css";
import "./components/PatientDashboard.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* ✅ Afficher `MainNavigation` seulement si on est dans l’espace praticien */}
        <ConditionalMainNavigation />

        {/* ✅ Contenu principal */}
        <div className="main-content">
          <Routes>
            {/* 📌 Pages du praticien */}
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/search" element={<SearchPage />} />

            {/* 📌 Pages du patient (avec le menu latéral `PatientDashboard`) */}
            <Route path="/dashboard/*" element={<PatientDashboardWrapper />} />

            {/* 📌 Page par défaut (redirige vers le calendrier) */}
            <Route path="*" element={<CalendarPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

/* ✅ Fonction qui affiche `MainNavigation` uniquement si on est en dehors de /dashboard */
const ConditionalMainNavigation = () => {
  const location = useLocation();
  return !location.pathname.startsWith("/dashboard") ? <MainNavigation /> : null;
};

/* ✅ Wrapper pour gérer `PatientDashboard` */
const PatientDashboardWrapper = () => {
  return (
    <div className="dashboard-wrapper">
      <PatientDashboard />
      <div className="dashboard-content">
        <Routes>
          <Route path="appointments" element={<h2>📅 Prise de rendez-vous</h2>} />
          <Route path="reminders" element={<h2>⏰ Rappel des rendez-vous</h2>} />
          <Route path="medical-record" element={<h2>📂 Mon dossier médical</h2>} />
          <Route path="pre-consultation" element={<h2>🩺 Pré-consultation</h2>} />
          <Route path="*" element={<h2>🏠 Page d'accueil patient</h2>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
