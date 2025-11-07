import axios from 'axios';

const API_URL = 'http://localhost:4000';

const register = (nombre, email, ingreso, password) => {
  return axios.post(`${API_URL}/usuarios`, {
    nombre,
    email,
    ingreso,
    password,
  });
};

const login = (email) => {
  return axios.get(`${API_URL}/usuarios/${email}`);
};

export default {
  register,
  login,
};
