import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientDashboard from "./components/PatientDashboard";
import "./components/PatientDashboard.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* ✅ Le menu reste à gauche */}
        <PatientDashboard />

        {/* ✅ Le contenu change dynamiquement à droite et ne colle plus au bord */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<h2><span className="icon">🏠</span> Page d'accueil</h2>} />
            <Route path="/dashboard/appointments" element={<h2><span className="icon">📅</span> Prise de rendez-vous</h2>} />
            <Route path="/dashboard/reminders" element={<h2><span className="icon">⏰</span> Rappel des rendez-vous</h2>} />
            <Route path="/dashboard/medical-record" element={<h2><span className="icon">📂</span> Mon dossier médical</h2>} />
            <Route path="/dashboard/pre-consultation" element={<h2><span className="icon">🩺</span> Pré-consultation</h2>} />
            <Route path="*" element={<h2><span className="icon">🏠</span> Accueil</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
