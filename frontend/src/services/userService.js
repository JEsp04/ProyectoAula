import api from "./api";

export const loginUser = async (email, password) => {
  const { data } = await api.post("/usuarios/login", { email, password });
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await api.post("/usuarios/crear", userData);
  return data;
};
