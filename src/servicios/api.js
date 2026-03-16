import axios from "axios";

// Usar variable de entorno en Railway, o localhost para desarrollo
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
console.log("🔥 API_URL siendo usada:", API_URL); 


const API = axios.create({
  baseURL: `${API_URL}/api/v1`
});

// Interceptor: agrega el token JWT a cada request si existe
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: redirige al login si el token expira (401/403)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;