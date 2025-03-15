import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGeneratedSlots } from "../api/api";
import "./PlanningPage.css";

const VIEW_MODES = {
  DAY: "day",
  THREE_DAYS: "three_days",
  WEEK: "week",
};

const PlanningPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState(VIEW_MODES.DAY);

  // ✅ Récupération des créneaux générés
  const { data: generatedSlots = [] } = useQuery({
    queryKey: ["generated-slots"],
    queryFn: fetchGeneratedSlots,
  });

  // 🔹 Trouver le lundi de la semaine sélectionnée
  const getMonday = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Si dimanche, reculer de 6 jours
    newDate.setDate(newDate.getDate() + diff);
    return newDate;
  };

  // 🔹 Générer la plage de dates en fonction du mode sélectionné
  const generateDateRange = () => {
    const range = [];
    let current = viewMode === VIEW_MODES.WEEK ? getMonday(selectedDate) : new Date(selectedDate);

    let daysToShow = viewMode === VIEW_MODES.WEEK ? 7 :
                     viewMode === VIEW_MODES.THREE_DAYS ? 3 : 1;

    for (let i = 0; i < daysToShow; i++) {
      range.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return range;
  };

  console.log("Créneaux reçus :", generatedSlots);
  const dateRange = generateDateRange();

  // 🔹 Filtrer les créneaux pour la période affichée
  const filteredSlots = generatedSlots.filter(slot =>
    dateRange.some(date => slot.date === date.toISOString().split("T")[0])
  );

  useEffect(() => {
    document.documentElement.style.setProperty("--days-shown", dateRange.length);
  }, [dateRange.length]);

  console.log("Créneaux après filtrage :", filteredSlots);

  return (
    <div className="planning-container">
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

      {/* ✅ Affichage multi-jours en colonnes avec ajustement automatique */}
      <div className={`calendar ${viewMode !== VIEW_MODES.DAY ? "multi-day" : ""}`}>
        {dateRange.map((date, index) => (
          <div key={date.toISOString()} className="day-column">
            <h2 className="date-header">{date.toLocaleDateString()}</h2>
            <div className="calendar">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="hour-row">
                  {/* ✅ Afficher les heures uniquement sur la première colonne */}
                  {index === 0 && <div className="hour-label">{8 + i}:00</div>}
                  <div className="slots">
                    {filteredSlots
                      .filter(slot => slot.date === date.toISOString().split("T")[0] && parseInt(slot.start_time.split(":")[0]) === 8 + i)
                      .map(slot => {
                        const startHour = parseInt(slot.start_time.split(":")[0]);
                        const startMinute = parseInt(slot.start_time.split(":")[1]);
                        const endHour = parseInt(slot.end_time.split(":")[0]);
                        const endMinute = parseInt(slot.end_time.split(":")[1]);

                        // ✅ Correction complète du calcul de la durée (heures et minutes)
                        const duration = Math.max((endHour - startHour) * 60 + (endMinute - startMinute), 1);

                        console.log(
                          "Créneau affiché :",
                          slot.start_time,
                          slot.end_time,
                          "Hauteur calculée :",
                          (duration / 60) * 100
                        );

                        return (
                          <div
                            key={slot.id}
                            className={`slot ${slot.is_reserved ? "reserved" : "available"}`}
                            style={{
                              height: `${(duration / 60) * 100}%`,
                              top: `${(startMinute / 60) * 100}%`, // Position en fonction de l'heure de début
                              position: "absolute", // Assurer un bon positionnement dans la grille
                            }}
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
    </div>
  );
};

export default PlanningPage;
