import api from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post("/usuarios/login", credentials);
  return response.data;
};


export const registerUser = async (data) => {
  const res = await api.post("/usuarios/register", data);
  return res.data;
};
