import React, { memo } from "react";
import "./PatientTabsBar.css"; // ✅ Assure que le CSS est bien appliqué

const PatientTabsBar = ({ openPatients, activePatient, setActivePatient, closePatient }) => {
  return (
    <div className="patient-tabs-bar">
      {openPatients.map((patient) => (
        <div
          key={patient.id}
          className={`tab ${activePatient?.id === patient.id ? "active" : ""}`}
          onClick={() => setActivePatient(patient)} /* ✅ Assure que l'onglet est cliquable */
        >
          <button
            onClick={(e) => {
              e.stopPropagation(); /* ✅ Empêche la fermeture en cliquant sur l'onglet */
              closePatient(patient.id);
            }}
          >
            ✖
          </button>
          {patient.name}
        </div>
      ))}
    </div>
  );
};

export default memo(PatientTabsBar);
