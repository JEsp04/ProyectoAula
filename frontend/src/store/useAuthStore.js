import { create } from "zustand";
import { loginUser, registerUser } from "../services/userService";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const user = await loginUser(email, password);
      set({ user, loading: false, error: null });
    } catch (err) {
      set({ error: err.response?.data?.message || "Error al iniciar sesión", loading: false });
    }
  },

  register: async (userData) => {
    set({ loading: true });
    try {
      const user = await registerUser(userData);
      set({ user, loading: false, error: null });
    } catch (err) {
      set({ error: err.response?.data?.message || "Error al registrarse", loading: false });
    }
  },

  logout: () => set({ user: null }),
}));
