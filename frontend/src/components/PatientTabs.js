import React, { useState } from "react";
import "./PatientTabs.css";

const PatientTabs = ({ patient }) => {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="patient-tabs-container">
      <div className="patient-tabs">
        <button className={activeTab === "summary" ? "active" : ""} onClick={() => setActiveTab("summary")}>Résumé</button>
        <button className={activeTab === "consultations" ? "active" : ""} onClick={() => setActiveTab("consultations")}>Consultations</button>
        <button className={activeTab === "exams" ? "active" : ""} onClick={() => setActiveTab("exams")}>Examens</button>
        <button className={activeTab === "hospital" ? "active" : ""} onClick={() => setActiveTab("hospital")}>Hospitalisations</button>
      </div>

      <div className="patient-content">
        {activeTab === "summary" && <p>Résumé médical de {patient.name}</p>}
        {activeTab === "consultations" && <p>Historique des consultations</p>}
        {activeTab === "exams" && <p>Examens complémentaires</p>}
        {activeTab === "hospital" && <p>Détails des hospitalisations</p>}
      </div>
    </div>
  );
};

export default PatientTabs;
