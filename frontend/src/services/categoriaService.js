import api from "./api";


export const asignarPresupuesto = async (category, amount) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const email = user?.email;
  if (!email) throw new Error("Usuario no autenticado");

  try {
    const response = await api.post(`/usuarios/${email}/presupuesto`, { categoria: category, monto: amount });
    return response.data;
  } catch (error) {
    console.error("Error al asignar presupuesto:", error.response?.data || error.message);
    throw error;
  }
};

