import { create } from 'zustand';
import axios from 'axios';

// Define la URL base de tu API. Ajústala si es diferente.
const API_URL = 'http://127.0.0.1:5000';

export const useUserStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,

  // --- ACCIÓN DE LOGIN ---
  login: async (email, password) => {
    try {
      set({ error: null }); // Limpia errores previos
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      // 1. Guarda el token en localStorage para persistir la sesión
      localStorage.setItem('token', token);

      // 2. Actualiza el estado del store
      set({ user, token, isAuthenticated: true, error: null });

      // 3. Redirige al Dashboard
      window.location.href = '/dashboard';

    } catch (err) {
      const errorMessage = err.response?.data?.error || "Error al iniciar sesión. Revisa tus credenciales.";
      console.error("Error de login:", errorMessage);
      set({ error: errorMessage, isAuthenticated: false });
    }
  },

  // (Aquí irían otras acciones como register, logout, etc.)
}));