import React, { memo } from "react";

const PatientView = ({ patient }) => {
  return (
    <div className="patient-view">
      <h2>{patient.name}</h2>
      <p>ID: {patient.id}</p>
      <p>Dossier médical en cours...</p>
    </div>
  );
};

// 🛠️ React.memo() empêche le re-rendu inutile du dossier patient si les infos ne changent pas
export default memo(PatientView);
