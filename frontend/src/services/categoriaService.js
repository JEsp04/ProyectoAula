import api from "./api";

export async function getCategories() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const email = user?.email;
  if (!email) return [];

  const res = await api.get(`/usuarios/ObtenerPor/${encodeURIComponent(email)}`);
  const usuario = res.data;
  const categorias = usuario.categorias || usuario.categories || {};
  if (Array.isArray(categorias)) return categorias.map((c) => c.nombre || c.name || c);
  if (typeof categorias === "object") return Object.keys(categorias);
  return [];
  
}

export const setBudget = async (category, amount) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const email = user?.email;
  if (!email) throw new Error("Usuario no autenticado");

  try {
    const response = await api.post(`/usuarios/${encodeURIComponent(email)}/presupuesto`, { categoria: category, monto: amount });
    return response.data;
  } catch (error) {
    console.error("Error al asignar presupuesto:", error.response?.data || error.message);
    throw error;
  }
};