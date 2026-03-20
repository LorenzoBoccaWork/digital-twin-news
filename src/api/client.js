import axios from 'axios';

// Istanza axios con base URL dal file .env
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Interceptor REQUEST: Aggiunge token JWT nell'header di autorizzazione
// Se il token esiste in localStorage, lo allega automaticamente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor RESPONSE: Gestisce token scaduti (401)
// Se la risposta è 401, cancella i dati locali e reindirizza al login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('company_id');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
