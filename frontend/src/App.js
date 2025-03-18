import React, { useReducer, useEffect, useCallback, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainNavigation from "./components/MainNavigation";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import ServicesPage from "./pages/ServicesPage";
import SearchPage from "./pages/SearchPage";
import PlanningPage from "./pages/PlanningPage"; // ✅ Import du planning
import PatientTabsBar from "./components/PatientTabsBar";


const PatientView = lazy(() => import("./components/PatientView"));

// 🎯 Reducer pour gérer les patients ouverts
const patientReducer = (state, action) => {
  switch (action.type) {
    case "ADD_PATIENT":
      return state.some(p => p.id === action.payload.id) ? state : [...state, action.payload];
    case "REMOVE_PATIENT":
      return state.filter(p => p.id !== action.payload);
    case "LOAD_PATIENTS":
      return action.payload;
    default:
      return state;
  }
};

const App = () => {
  const [openPatients, dispatch] = useReducer(patientReducer, []);
  const [activePatient, setActivePatient] = React.useState(null);

  useEffect(() => {
    try {
      const savedPatients = JSON.parse(localStorage.getItem("openPatients"));
      if (Array.isArray(savedPatients) && savedPatients.length > 0) {
        dispatch({ type: "LOAD_PATIENTS", payload: savedPatients });
        setActivePatient(savedPatients[0]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des patients :", error);
    }
  }, []);

  useEffect(() => {
    if (openPatients.length > 0) {
      localStorage.setItem("openPatients", JSON.stringify(openPatients));
    } else {
      localStorage.removeItem("openPatients");
    }
  }, [openPatients]);

  const openPatient = useCallback((patient) => {
    dispatch({ type: "ADD_PATIENT", payload: patient });
    setActivePatient(patient);
  }, [dispatch]);

  const closePatient = useCallback((patientId) => {
    dispatch({ type: "REMOVE_PATIENT", payload: patientId });
    if (activePatient?.id === patientId) {
      setActivePatient(openPatients.length > 1 ? openPatients[0] : null);
    }
  }, [dispatch, openPatients, activePatient]);

  return (
    <Router>
      <MainNavigation setActivePatient={setActivePatient} />
      <PatientTabsBar
        openPatients={openPatients}
        activePatient={activePatient}
        setActivePatient={setActivePatient}
        closePatient={closePatient}
      />
      <div className="main-content">
        {activePatient ? (
          <Suspense fallback={<div>Chargement du dossier patient...</div>}>
            <PatientView patient={activePatient} />
          </Suspense>
        ) : (
          <Routes>
            <Route path="/home" element={<HomePage openPatient={openPatient} />} />
            <Route path="/calendar" element={<CalendarPage openPatient={openPatient} />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/search" element={<SearchPage openPatient={openPatient} />} />  {/* ✅ Ajout du prop ici */}
            <Route path="/planning" element={<PlanningPage />} />  {/* ✅ Ajout du planning */}
            <Route path="*" element={<HomePage openPatient={openPatient} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
