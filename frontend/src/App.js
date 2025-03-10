import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientDashboard from "./components/PatientDashboard";
import "./components/PatientDashboard.css"; // ✅ Ajout du CSS ici

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* ✅ Le menu reste à gauche */}
        <PatientDashboard />

        {/* ✅ Le contenu change dynamiquement à droite */}
        <div className="main-content">
          <Routes>
            <Route path="/dashboard/appointments" element={<h2>📅 Page Prise de rendez-vous</h2>} />
            <Route path="/dashboard/reminders" element={<h2>⏰ Page Rappel des rendez-vous</h2>} />
            <Route path="/dashboard/medical-record" element={<h2>📂 Page Mon dossier médical</h2>} />
            <Route path="/dashboard/pre-consultation" element={<h2>🩺 Page Pré-consultation</h2>} />
            <Route path="*" element={<h2>🏠 Accueil</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
