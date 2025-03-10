import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`dashboard-container ${isCollapsed ? "collapsed" : ""}`}>
      {/* Bouton ☰ pour réouvrir le dashboard lorsqu'il est réduit */}
      {isCollapsed && (
        <button className="menu-button" onClick={() => setIsCollapsed(false)}>☰</button>
      )}

      {/* Contenu du dashboard */}
      {!isCollapsed && (
        <div className="dashboard-content">
          {/* ✅ Bouton X BIEN positionné en haut à gauche */}
          <button className="close-button" onClick={() => setIsCollapsed(true)}>✖</button>
          <h1>Tableau de bord - Patient</h1>
          <div className="dashboard-grid">
            {/* ✅ Les liens changent seulement le contenu, sans recharger la page */}
            <Link to="/dashboard/appointments" className="dashboard-card">📅 Prise de rendez-vous</Link>
            <Link to="/dashboard/reminders" className="dashboard-card">⏰ Rappel des rendez-vous</Link>
            <Link to="/dashboard/medical-record" className="dashboard-card">📂 Mon dossier médical</Link>
            <Link to="/dashboard/pre-consultation" className="dashboard-card">🩺 Pré-consultation</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
