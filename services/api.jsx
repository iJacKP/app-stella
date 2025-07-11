import axios from 'axios';
import { getToken } from "./auth";
const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080/api/"
    : "https://api-stella-800g.onrender.com/api/";

const api = axios.create({
  baseURL,
});
// interceptor de autenticação
api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;