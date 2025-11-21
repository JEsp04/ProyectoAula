import { create } from "zustand";
import api from "../services/api"; // instancia axios/fetch wrapper que ya usas
import { loginUser, registerUser } from "../services/authService";

const storedUser = localStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

const normalize = (s) =>
  s ? String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";


const syncUserDataToLocalStorage = (usuario) => {
  if (!usuario) return;
  console.log("[syncUserDataToLocalStorage] usuario:", usuario);

  const presupuestos = {};
  const categoriasObj = usuario.categorias || usuario.categories || {};
  if (Array.isArray(categoriasObj)) {
    categoriasObj.forEach((cat) => {
      const name = cat.nombre || cat.name || cat.categoria || "";
      const key = normalize(name);
      const val = Number(cat.presupuestoMensual ?? cat.presupuestoInicial ?? cat.presupuesto ?? 0) || 0;
      if (key) presupuestos[key] = val;
    });
  } else {
    Object.entries(categoriasObj).forEach(([k, v]) => {
      const candidateName = (v && (v.nombre || v.name)) || k;
      const key = normalize(candidateName);
      const val =
        typeof v === "number"
          ? v
          : Number(v.presupuestoMensual ?? v.presupuestoInicial ?? v.presupuesto ?? v.monto ?? 0) || 0;
      presupuestos[key] = val;
    });
  }
  localStorage.setItem("presupuestos", JSON.stringify(presupuestos));

  // GASTOS: aplanar movimientos desde cada categoria -> localStorage.gastos
  const gastos = [];
  Object.entries(categoriasObj || {}).forEach(([catKey, catVal]) => {
    const movimientos = (catVal && (catVal.movimientos || catVal.movimientosMensuales || catVal.movimientos || [])) || [];
    // algunos formatos devuelven array vacío o undefined
    if (!Array.isArray(movimientos)) return;
    movimientos.forEach((m, idx) => {
      const categoriaNombre = m.categoria ?? m.categoria_nombre ?? catVal.nombre ?? catKey;
      gastos.push({
        id: m.id ?? m._id ?? `${Date.now()}-${idx}`,
        nombre: m.descripcion ?? m.nombre ?? m.title ?? "",
        monto: Number(m.monto ?? m.valor ?? m.amount ?? 0) || 0,
        categoria: categoriaNombre,
        _categoria_norm: normalize(categoriaNombre),
        fecha: m.fecha ?? m.createdAt ?? new Date().toISOString(),
      });
    });
  });

  // además soportar migración si el backend devolviera historial plano
  const historialPlano = usuario.historial || usuario.gastos || usuario.movimientos;
  if (Array.isArray(historialPlano) && historialPlano.length > 0) {
    historialPlano.forEach((h, idx) => {
      const categoriaNombre = h.categoria ?? h.category ?? "";
      gastos.push({
        id: h.id ?? h._id ?? `${Date.now()}-h-${idx}`,
        nombre: h.descripcion ?? h.nombre ?? "",
        monto: Number(h.monto ?? h.valor ?? h.amount ?? 0) || 0,
        categoria: categoriaNombre,
        _categoria_norm: normalize(categoriaNombre),
        fecha: h.fecha ?? h.createdAt ?? new Date().toISOString(),
      });
    });
  }

  localStorage.setItem("gastos", JSON.stringify(gastos));
  console.log("[syncUserDataToLocalStorage] guardado presupuestos/gastos", { presupuestos, gastos });

  // notificar UI en la misma pestaña
  window.dispatchEvent(new Event("user:sync"));
};

// sincronizar si ya hay usuario en localStorage al arrancar
if (parsedUser) syncUserDataToLocalStorage(parsedUser);

export const useAuthStore = create((set) => ({
  user: parsedUser || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,

  login: async (credentials) => {
  set({ loading: true, error: null });

  try {
    const res = await loginUser(credentials);

    const usuario = res.usuario || res.user || res.data;
    const token = res.token || res.access_token;

    if (token) localStorage.setItem("token", token);
    if (usuario) localStorage.setItem("user", JSON.stringify(usuario));

    syncUserDataToLocalStorage(usuario);

    set({
      user: usuario,
      token,
      isAuthenticated: true,
      error: null,
    });

    return { usuario, token };
  } catch (err) {
    const msg = err?.response?.data?.detail || err.message || "Error al iniciar sesión";
    set({ error: msg, isAuthenticated: false });
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await registerUser(data);
      console.log("[useAuthStore.register] response:", res);

      let usuario = res.usuario || res.user || res.data || null;
      const token = res.token || res.access_token || null;

      // pedir usuario completo si viene incompleto
      if (usuario && (!usuario.historial && !usuario.categorias)) {
        try {
          const email = usuario.email;
          const full = await api.get(`/usuarios/ObtenerPor/${encodeURIComponent(email)}`);
          usuario = full.data;
        } catch (err) {
          console.warn("[useAuthStore.register] no se pudo obtener usuario completo:", err);
        }
      }

      if (token) localStorage.setItem("token", token);
      if (usuario) localStorage.setItem("user", JSON.stringify(usuario));
      syncUserDataToLocalStorage(usuario);

      set({ user: usuario || null, token: token || null, isAuthenticated: !!token });
      return { usuario, token };
    } catch (err) {
      console.error("[useAuthStore.register] error:", err);
      const msg = err?.response?.data?.detail || err.message || "Error al registrar";
      set({ error: msg });
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("gastos");
    localStorage.removeItem("presupuestos");
    set({ user: null, token: null, isAuthenticated: false });
    window.dispatchEvent(new Event("user:sync"));
  },

  updateUser: (updatedUser) => {
    set({ user: updatedUser });
    localStorage.setItem("user", JSON.stringify(updatedUser));
    // Opcional: podrías querer resincronizar todo, aunque con esto es suficiente para el ingreso
    syncUserDataToLocalStorage(updatedUser); 
  },


}));
