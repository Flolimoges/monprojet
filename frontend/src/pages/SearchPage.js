import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPatients } from "../api/api";

const SearchPage = ({ openPatient }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Récupération des patients via API avec React Query
  const { data: patients, isLoading, error } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <p>Chargement des patients...</p>;
  if (error) return <p>Erreur lors du chargement des patients.</p>;

  // 🔍 Filtrer les patients selon la recherche
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="search-container">
      <h1>Recherche de Patients</h1>
      <input
        type="text"
        placeholder="Rechercher un patient..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <ul className="patient-list">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <li key={patient.id} className="patient-item">
              {patient.name}
              <button className="open-patient-btn" onClick={() => openPatient(patient)}>
                📂 Ouvrir
              </button>
            </li>
          ))
        ) : (
          <p>Aucun patient trouvé.</p>
        )}
      </ul>
    </div>
  );
};

export default SearchPage;
