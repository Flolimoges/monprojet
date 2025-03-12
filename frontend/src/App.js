import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainNavigation from "./components/MainNavigation";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import ServicesPage from "./pages/ServicesPage";
import SearchPage from "./pages/SearchPage";
import PatientTabsBar from "./components/PatientTabsBar"; // Barre d'onglets des dossiers patients
import PatientView from "./components/PatientView"; // Contenu du dossier patient

const App = () => {
  const [openPatients, setOpenPatients] = useState([]); // Liste des patients ouverts
  const [activePatient, setActivePatient] = useState(null); // Patient actuellement affiché

  // Ouvre un dossier patient (ajoute un onglet s'il n'existe pas encore)
  const openPatient = (patient) => {
    if (!openPatients.some(p => p.id === patient.id)) {
      setOpenPatients([...openPatients, patient]);
    }
    setActivePatient(patient); // Active ce patient
  };

  // Ferme un onglet patient
  const closePatient = (patientId) => {
    const updatedPatients = openPatients.filter(p => p.id !== patientId);
    setOpenPatients(updatedPatients);
    if (activePatient?.id === patientId) {
      setActivePatient(updatedPatients.length > 0 ? updatedPatients[0] : null);
    }
  };

  return (
    <Router>
      <MainNavigation setActivePatient={setActivePatient} /> {/* Navigation principale */}
      <PatientTabsBar openPatients={openPatients} activePatient={activePatient} setActivePatient={setActivePatient} closePatient={closePatient} />

      <div className="main-content">
        {activePatient ? (
          <PatientView patient={activePatient} />
        ) : (
          <Routes>
            <Route path="/home" element={<HomePage openPatient={openPatient} />} />
            <Route path="/calendar" element={<CalendarPage openPatient={openPatient} />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<HomePage openPatient={openPatient} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
