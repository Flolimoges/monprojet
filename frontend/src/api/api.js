import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // ✅ Change ici si l'URL de l'API évolue

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // ✅ Timeout de 5 secondes pour éviter les requêtes bloquées
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Ajoute un "interceptor" pour gérer automatiquement les erreurs API
api.interceptors.response.use(
  (response) => response, // Renvoie la réponse normale si OK
  (error) => {
    console.error("Erreur API :", error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

// 🔹 Fonction pour récupérer la liste des patients
export const fetchPatients = async () => {
  try {
    const response = await api.get("/patients/");
    return response.data;
  } catch (error) {
    return [];
  }
};

// 🔹 Fonction pour récupérer un patient par son ID
export const fetchPatientById = async (id) => {
  try {
    const response = await api.get(`/patients/${id}/`);
    return response.data;
  } catch (error) {
    return null;
  }
};

// 🔹 Fonction pour créer un rendez-vous
export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post("/appointments/", appointmentData);
    return response.data;
  } catch (error) {
    return null;
  }
};

// 🔹 Fonction pour supprimer un rendez-vous
export const deleteAppointment = async (appointmentId) => {
  try {
    await api.delete(`/appointments/${appointmentId}/`);
    return true;
  } catch (error) {
    return false;
  }
};

// 🔹 Fonction pour récupérer les créneaux générés (disponibilités)
export const fetchGeneratedSlots = async () => {
  try {
    const response = await api.get("/generated-slots/");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des créneaux :", error);
    return [];
  }
};

// 🔹 Fonction pour récupérer la liste des rendez-vous
export const fetchAppointments = async () => {
  try {
    const response = await api.get("/appointments/");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous :", error);
    return [];
  }
};

export default api;
