import React from "react";

const CalendarPage = ({ openPatient }) => {
  const handleOpenPatient = () => {
    openPatient({ id: Date.now(), name: `Patient ${Math.floor(Math.random() * 100)}` });
  };

  return (
    <div className="calendar-container">
      <h1>Calendrier</h1>
      <button className="open-patient-btn" onClick={handleOpenPatient}>📂 Ouvrir un Dossier Patient</button>
    </div>
  );
};

export default CalendarPage;
