import api from "./api";

export async function getExpenses() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const email = user?.email;
  if (!email) return [];

  const res = await api.get(`/usuarios/ObtenerPor/${encodeURIComponent(email)}`);
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
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const email = expense.email || user?.email;
  if (!email) throw new Error("Usuario no autenticado");

  const payload = {
    nombre: expense.nombre ?? expense.descripcion ?? "",
    monto: Number(expense.monto ?? expense.valor ?? 0),
    categoria: expense.categoria ?? "",
    fecha: expense.fecha ?? new Date().toISOString(),
  };

  const res = await api.post(`/usuarios/${encodeURIComponent(email)}/gasto`, payload);
  const data = res.data || {};

  // gasto puede venir en data.gasto o data.expense o en la misma respuesta
  const gasto = data.gasto || data.expense || data;

  // si backend devuelve usuario actualizado, persistirlo y sincronizar localStorage
  const usuarioActualizado = data.usuario || data.user;
  if (usuarioActualizado) {
    localStorage.setItem("user", JSON.stringify(usuarioActualizado));

    const gastos = usuarioActualizado.historial || usuarioActualizado.gastos || usuarioActualizado.movimientos || [];
    localStorage.setItem("gastos", JSON.stringify(Array.isArray(gastos) ? gastos : []));

    const categorias = usuarioActualizado.categorias || usuarioActualizado.categories || {};
    // normalizamos presupuestos a objeto plano si backend devuelve en otro formato
    const presupuestos =
      Array.isArray(categorias) ? categorias.reduce((acc, c) => { acc[c.nombre || c.name] = Number(c.presupuestoInicial ?? c.presupuesto ?? 0); return acc; }, {}) : categorias;
    localStorage.setItem("presupuestos", JSON.stringify(presupuestos));

    // notificar UI en la misma pestaña
    window.dispatchEvent(new Event("user:sync"));
  }

  return gasto;
}

export default { getExpenses, createExpense };

