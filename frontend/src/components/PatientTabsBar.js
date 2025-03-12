import React from "react";
import "./PatientTabsBar.css";

const PatientTabsBar = ({ openPatients, activePatient, setActivePatient, closePatient }) => {
  return (
    <div className="patient-tabs-bar">
      {openPatients.map(patient => (
        <button
          key={patient.id}
          className={`patient-tab ${activePatient?.id === patient.id ? "active" : ""}`}
          onClick={() => setActivePatient(patient)}
        >
          {patient.name}
          <span className="close-btn" onClick={(e) => { e.stopPropagation(); closePatient(patient.id); }}>✖</span>
        </button>
      ))}
    </div>
  );
};

export default PatientTabsBar;
