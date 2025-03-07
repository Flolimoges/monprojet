import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [slots, setSlots] = useState([]);

    // Charger les créneaux depuis Django
useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/generated-slots/')
        .then(response => {
            console.log("Données reçues :", response.data);  // 🛠️ Debug dans la console
            setSlots(response.data);
        })
        .catch(error => console.error('Erreur API:', error));
}, []);


    return (
        <div>
            <h1>Créneaux disponibles</h1>
            <ul>
                {slots.map(slot => (
                    <li key={slot.id}>
                        {slot.date} ({slot.start_time} - {slot.end_time})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
