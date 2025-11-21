import api from "./api";

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/usuarios/login", credentials);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const registerUser = async (data) => {
  const payload = {
    nombre: data.nombre,
    email: data.email,
    ingreso_mensual: Number(data.ingreso_mensual) || 0,
    password: data.password,
  };

  try {
    const res = await api.post("/usuarios/register", payload);
    return res.data;
  } catch (err) {
    throw err; 
  }
};
