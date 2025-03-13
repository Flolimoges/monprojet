import React from "react";

const CalendarPage = ({ openPatient }) => {
  return (
    <div className="calendar-container">
      <h1>Calendrier</h1>
      <button className="open-patient-btn" onClick={() => openPatient({ id: Date.now(), name: "Patient Test" })}>
        📂 Ouvrir un Dossier Patient
      </button>
    </div>
  );
};

export default CalendarPage;
