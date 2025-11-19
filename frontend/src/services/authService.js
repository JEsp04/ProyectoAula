import api from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post("/usuarios/login", credentials);
  return response.data;
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
    if (err.response && err.response.data) {
      console.log("Error Backend: ", err.response?.data || err);
      throw err.response?.data || err;
    }
    throw err;
  }
};
