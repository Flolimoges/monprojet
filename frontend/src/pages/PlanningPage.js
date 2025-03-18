import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGeneratedSlots, fetchPatients } from "../api/api"; // Importation des API
import "./PlanningPage.css";

const VIEW_MODES = {
  DAY: "day",
  THREE_DAYS: "three_days",
  WEEK: "week",
};

const PlanningPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState(VIEW_MODES.DAY);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ✅ Récupération des créneaux générés
  const { data: generatedSlots = [] } = useQuery({
    queryKey: ["generated-slots"],
    queryFn: fetchGeneratedSlots,
  });

  // ✅ Récupération de la liste des patients
  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });

  // 🔹 Trouver le lundi de la semaine sélectionnée
  const getMonday = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    newDate.setDate(newDate.getDate() + diff);
    return newDate;
  };

  // 🔹 Générer la plage de dates en fonction du mode sélectionné
  const generateDateRange = () => {
    const range = [];
    let current = viewMode === VIEW_MODES.WEEK ? getMonday(selectedDate) : new Date(selectedDate);
    let daysToShow = viewMode === VIEW_MODES.WEEK ? 7 : viewMode === VIEW_MODES.THREE_DAYS ? 3 : 1;

    for (let i = 0; i < daysToShow; i++) {
      range.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return range;
  };

  const dateRange = generateDateRange();

  // 🔹 Filtrer les créneaux pour la période affichée
  const filteredSlots = generatedSlots.filter(slot =>
    dateRange.some(date => slot.date === date.toISOString().split("T")[0])
  );

  useEffect(() => {
    document.documentElement.style.setProperty("--days-shown", dateRange.length);
  }, [dateRange.length]);

  // 🔹 Filtrer les patients en fonction de la recherche
  const filteredPatients = searchTerm
    ? patients.filter(patient => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // ✅ Fonction pour ouvrir le popup
  const openPopup = (slot) => {
    setSelectedSlot(slot);
    setSelectedPatient(null);
  };

  // ✅ Fonction pour fermer le popup
  const closePopup = () => {
    setSelectedSlot(null);
    setSearchTerm("");
    setSelectedPatient(null);
  };

  // ✅ Fonction pour ajouter un patient au créneau
  const handleAddPatient = () => {
    if (selectedPatient && selectedSlot) {
      console.log(`Patient ${selectedPatient.name} ajouté au créneau ${selectedSlot.start_time} - ${selectedSlot.end_time}`);
      closePopup();
    }
  };

  return (
    <div className={`planning-container ${selectedSlot ? "modal-open" : ""}`}>
      <h1>📅 Planning des consultations</h1>

      <div className="planning-controls">
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="date-picker"
        />
        <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <option value={VIEW_MODES.DAY}>Jour</option>
          <option value={VIEW_MODES.THREE_DAYS}>3 Jours</option>
          <option value={VIEW_MODES.WEEK}>Semaine</option>
        </select>
      </div>

      <div className={`calendar ${viewMode !== VIEW_MODES.DAY ? "multi-day" : ""}`}>
        {dateRange.map((date, index) => (
          <div key={date.toISOString()} className="day-column">
            <h2 className="date-header">{date.toLocaleDateString()}</h2>
            <div className="calendar">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="hour-row">
                  {index === 0 && <div className="hour-label">{8 + i}:00</div>}
                  <div className="slots">
                    {filteredSlots
                      .filter(slot => slot.date === date.toISOString().split("T")[0] && parseInt(slot.start_time.split(":")[0]) === 8 + i)
                      .map(slot => {
                        const duration = Math.max(
                          (parseInt(slot.end_time.split(":")[0]) - parseInt(slot.start_time.split(":")[0])) * 60 +
                          (parseInt(slot.end_time.split(":")[1]) - parseInt(slot.start_time.split(":")[1])),
                          1
                        );

                        return (
                          <div
                            key={slot.id}
                            className={`slot ${slot.is_reserved ? "reserved" : "available"}`}
                            style={{
                              height: `${(duration / 60) * 100}%`,
                              top: `${(parseInt(slot.start_time.split(":")[1]) / 60) * 100}%`,
                              position: "absolute",
                              zIndex: 2, /* Assure que le slot est au-dessus */
                              cursor: "pointer", /* Améliore la sélection */
                            }}
                            onClick={() => openPopup(slot)}
                          >
                            <span className="slot-time">{slot.start_time} - {slot.end_time}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Modal pour l'ajout d'un patient */}
      {selectedSlot && (
        <div className="modal-overlay" onClick={closePopup}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Ajouter un patient au créneau</h2>
            <p><strong>Heure :</strong> {selectedSlot.start_time} - {selectedSlot.end_time}</p>
            <input
              type="text"
              placeholder="Rechercher un patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Afficher la liste seulement si une recherche est effectuée */}
            {searchTerm && (
              <ul className="patient-list">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map(patient => (
                    <li
                      key={patient.id}
                      className={`patient-item ${selectedPatient?.id === patient.id ? "selected" : ""}`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      {patient.name}
                    </li>
                  ))
                ) : (
                  <li className="no-results">Aucun patient trouvé</li>
                )}
              </ul>
            )}
            {selectedPatient && (
              <button className="add-patient-btn" onClick={handleAddPatient}>Ajouter</button>
            )}
            <button className="close-modal" onClick={closePopup}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningPage;
