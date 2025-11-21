import api from "./api";

export async function getExpenses() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const email = user?.email;
  if (!email) return [];

  const res = await api.get(`/usuarios/ObtenerPor/${email}`);
  const data = res.data || {};

  // soportar distintos formatos: { usuario: {...} } | { user: {...} } | {...usuario fields...}
  const usuario = data.usuario || data.user || data;
  const historial = usuario?.historial || usuario?.gastos || usuario?.movimientos || [];
  return Array.isArray(historial) ? historial : [];
}

/**
 * Crea un gasto en el backend (/usuarios/{email}/gasto) y devuelve el gasto creado.
 * También sincroniza user/gastos/presupuestos en localStorage si el backend devuelve el usuario actualizado.
 */
export async function createExpense(expense) {
  const user = JSON.parse(localStorage.getItem("user"));
  const payload = expense;

  if (!user?.email) throw new Error("Usuario no autenticado");

  const res = await api.post(`/usuarios/${user.email}/gasto`, payload);
  const data = res.data;

  return data.movimiento;
}

export default { getExpenses, createExpense };

