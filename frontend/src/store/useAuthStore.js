import { create } from "zustand";
import { loginUser, registerUser } from "../services/authService";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });

    try {
      const res = await loginUser(credentials);

      const { usuario, token } = res;

      // Guardar token y usuario en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuario));

      // Actualizar estado
      set({
        user: usuario,
        token,
        isAuthenticated: true,
        error: null,
      });

      return res;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Error al iniciar sesión";
      set({ error: errorMessage, isAuthenticated: false });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      const res = await registerUser(data);
      const { usuario, token } = res;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuario));

      set({ user: usuario, token, isAuthenticated: true });
      return res;
    } catch (err) {
      throw err.response?.data?.detail || "Error al registrar usuario";
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
