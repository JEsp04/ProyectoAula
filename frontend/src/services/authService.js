import axios from "axios";

const API_URL = "http://localhost:4000/api/users"; // cambia el puerto según tu backend

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const registerUser = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};
