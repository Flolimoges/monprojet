import React from "react";
import "./TabManager.css";
import PatientTabs from "./PatientTabs";

const TabManager = ({ openTabs, closePatientTab }) => {
  return (
    <div className="tab-manager">
      {openTabs.map((patient) => (
        <div key={patient.id} className="tab">
          <button className="tab-close" onClick={() => closePatientTab(patient.id)}>✖</button>
          <h3>{patient.name}</h3>
          <PatientTabs patient={patient} />
        </div>
      ))}
    </div>
  );
};

export default TabManager;
