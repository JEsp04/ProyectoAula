import api from "./api";

export const obtenerUsuarios = async () => {
  const res = await api.get("/usuarios/ObtenerTodos");
  return res.data;
};


export const obtenerUsuarioPorEmail = async (email) => {
  const res = await api.get(`/usuarios/ObtenerPor/${email}`);
  return res.data;
};

export const updateUserIncome = async (email, income) => {
  try {
    const response = await api.put(`/usuarios/${encodeURIComponent(email)}/ingreso`, { ingreso_mensual: income });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el ingreso:", error.response?.data || error.message);
    throw error;
  }
};
