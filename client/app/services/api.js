import axios from "axios";

// Use relative URL to leverage Next.js proxy
// Use environment variable for API URL, fallback to relative path (proxy)
const baseURL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
  : "/api";
console.log("Using API Base URL:", baseURL);

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

export const fetchSheets = (page = 1, limit = 10) => api.get(`/sheets?page=${page}&limit=${limit}`);
export const fetchSheetById = (id) => api.get(`/sheets/${id}`);
export const createSheet = (data) => api.post("/sheets", data);
export const updateSheet = (id, data) => api.put(`/sheets/${id}`, data);
export const deleteSheet = (id) => api.delete(`/sheets/${id}`);

export const addProblem = (sheetId, data) => api.post(`/sheets/${sheetId}/problems`, data);
export const deleteProblem = (id) => api.delete(`/sheets/problems/${id}`);
export const toggleProblemStatus = (problemId) => api.put(`/sheets/problems/${problemId}/toggle`);

export default api;
