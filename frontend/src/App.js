import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);
  const [reservedSlots, setReservedSlots] = useState(new Set()); // Stocke les créneaux réservés
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/availabilities/").then(res => res.json()),
      fetch("http://127.0.0.1:8000/api/appointments/").then(res => res.json())
    ])
    .then(([availabilities, appointments]) => {
      const reserved = new Set(appointments.map(appt => `${appt.doctor}-${appt.date}-${appt.start_time}`));

      const formattedEvents = availabilities.map(slot => ({
        id: slot.id,
        doctor: slot.doctor,
        title: `Dr ${slot.doctor} - ${slot.duration} min`,
        date: slot.date,
        start: new Date(`${slot.date}T${slot.start_time}`),
        end: new Date(`${slot.date}T${slot.end_time}`),
        isReserved: reserved.has(`${slot.doctor}-${slot.date}-${slot.start_time}`) // Marquer les créneaux réservés
      }));

      setEvents(formattedEvents);
      setReservedSlots(reserved);
    })
    .catch(error => console.error("Erreur :", error));
  }, []);

  // Fonction de réservation
  const handleReservation = () => {
    if (!selectedSlot || reservedSlots.has(`${selectedSlot.doctor}-${selectedSlot.date}-${selectedSlot.start_time}`)) return;

    fetch("http://127.0.0.1:8000/api/appointments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        doctor: selectedSlot.doctor,
        patient: 1, // ⚠️ À remplacer par l’ID du patient connecté
        date: selectedSlot.date,
        start_time: selectedSlot.start.toTimeString().split(" ")[0]
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur lors de la réservation !");
      }
      return response.json();
    })
    .then(data => {
      setMessage("✅ Réservation confirmée !");
      setSelectedSlot(null);

      // Ajouter le créneau réservé à `reservedSlots` pour le griser
      setReservedSlots(prev => new Set([...prev, `${selectedSlot.doctor}-${selectedSlot.date}-${selectedSlot.start_time}`]));

      // Mettre à jour les événements pour griser le créneau
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === selectedSlot.id ? { ...event, isReserved: true } : event
        )
      );
    })
    .catch(error => {
      setMessage("⚠️ Échec de la réservation !");
      console.error("Erreur :", error);
    });
  };

  // Style conditionnel pour les créneaux réservés
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.isReserved ? "#D3D3D3" : "#3174ad", // Gris si réservé, bleu sinon
      color: event.isReserved ? "black" : "white",
      opacity: event.isReserved ? 0.6 : 1,
      cursor: event.isReserved ? "not-allowed" : "pointer"
    };
    return { style };
  };

  return (
    <div style={{ height: "80vh", padding: "20px" }}>
      <h1>Agenda des disponibilités</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "70vh" }}
        onSelectEvent={(event) => {
          if (!event.isReserved) setSelectedSlot(event);
        }}
        eventPropGetter={eventStyleGetter} // Applique le style aux événements
      />

      {selectedSlot && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid black" }}>
          <p><strong>Créneau sélectionné :</strong> {selectedSlot.title} ({selectedSlot.start.toLocaleString()})</p>
          <button onClick={handleReservation} disabled={reservedSlots.has(`${selectedSlot.doctor}-${selectedSlot.date}-${selectedSlot.start_time}`)}>
            Réserver
          </button>
        </div>
      )}

      {message && <p style={{ color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
    </div>
  );
}

export default App;
