import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); // 🔹 Permet de détecter la page active

  return (
    <div className={`dashboard-container ${isCollapsed ? "collapsed" : ""}`}>
      {/* Bouton ☰ pour réouvrir le menu */}
      {isCollapsed && (
        <button className="menu-button" onClick={() => setIsCollapsed(false)}>☰</button>
      )}

      {/* Contenu du menu */}
      {!isCollapsed && (
        <div className="dashboard-content">
          {/* Bouton X pour fermer le menu */}
          <button className="close-button" onClick={() => setIsCollapsed(true)}>✖</button>
          <h1>Tableau de bord</h1>
          <div className="dashboard-grid">
            {/* ✅ Ajout d’un <span> autour de l’icône pour garantir un bon alignement */}
            <Link to="/" className={`dashboard-card ${location.pathname === "/" ? "active" : ""}`}>
              <span className="icon">🏠</span> <span className="text">Page d'accueil</span>
            </Link>
            <Link to="/dashboard/appointments" className={`dashboard-card ${location.pathname === "/dashboard/appointments" ? "active" : ""}`}>
              <span className="icon">📅</span> <span className="text">Prise de rendez-vous</span>
            </Link>
            <Link to="/dashboard/reminders" className={`dashboard-card ${location.pathname === "/dashboard/reminders" ? "active" : ""}`}>
              <span className="icon">⏰</span> <span className="text">Rappel des rendez-vous</span>
            </Link>
            <Link to="/dashboard/medical-record" className={`dashboard-card ${location.pathname === "/dashboard/medical-record" ? "active" : ""}`}>
              <span className="icon">📂</span> <span className="text">Mon dossier médical</span>
            </Link>
            <Link to="/dashboard/pre-consultation" className={`dashboard-card ${location.pathname === "/dashboard/pre-consultation" ? "active" : ""}`}>
              <span className="icon">🩺</span> <span className="text">Pré-consultation</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
