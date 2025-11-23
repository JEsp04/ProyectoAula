import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // cambia al puerto de tu backend
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default api;
