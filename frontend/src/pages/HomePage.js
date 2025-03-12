import React from "react";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header>
        <h1>Bienvenue sur la Plateforme Médicale</h1>
        <p>Gérez vos rendez-vous et dossiers médicaux en toute simplicité.</p>
      </header>

      <div className="card-container">
        <div className="card">
          <h2>📅 Prendre un Rendez-vous</h2>
          <p>Consultez le calendrier et réservez un créneau en ligne.</p>
          <button>Accéder</button>
        </div>

        <div className="card">
          <h2>🏥 Services Médicaux</h2>
          <p>Découvrez les services et professionnels de santé disponibles.</p>
          <button>Découvrir</button>
        </div>

        <div className="card">
          <h2>🔎 Recherche</h2>
          <p>Recherchez un dossier patient ou une consultation.</p>
          <button>Rechercher</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
