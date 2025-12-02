import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
const baseURL = backendUrl.endsWith("/api") ? backendUrl : `${backendUrl}/api`;
// const baseURL = "http://localhost:5000/api";

console.log("API Base URL:", baseURL);

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
