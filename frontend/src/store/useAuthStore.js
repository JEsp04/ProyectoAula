import { create } from "zustand";
import { loginUser, registerUser } from "../services/authService";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null }); // Limpiar errores previos
    try {
      const res = await loginUser(credentials);
      // Guardar el usuario y limpiar cualquier error previo
      set({ user: res.usuario, isAuthenticated: true, error: null });
      return res;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Error al iniciar sesión";
      set({ error: errorMessage }); // Guardar el error en el estado
      throw new Error(errorMessage); // Lanzar el error para que el componente lo capture
    } finally {
      set({ loading: false });
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      const res = await registerUser(data);
      set({ user: res.usuario, isAuthenticated: true });
      return res;
    } catch (err) {
      throw err.response?.data?.detail || "Error al registrar usuario";
    } finally {
      set({ loading: false });
    }
  },

  logout: () => set({ user: null, isAuthenticated: false }),
}));