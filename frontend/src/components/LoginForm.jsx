import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Importar useNavigate para la redirección
import { useAuthStore } from "../store/useAuthStore";

const LoginForm = () => {
  useEffect(() => {
  useAuthStore.getState().logout();
}, []);
  // 2. Obtener loading y error del store
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);



  const navigate = useNavigate(); // 3. Inicializar el hook de navegación
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/dashboard"); // 4. Redirigir al dashboard si el login es exitoso
    } catch (err) {
      // El error ya se maneja en el store, aquí no es necesario hacer nada
      console.error(err); // Opcional: loguear el error en la consola
    }
  };
    return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 shadow-lg rounded-lg w-full max-w-sm mx-auto mt-10 transition-colors duration-300">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">Inicia sesión</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
      {/* 5. Mostrar el mensaje de error del store si existe */}
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      <button 
        type="submit"
        className="bg-[#4F46E5] text-white py-2 px-4 rounded w-full hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-400"
        disabled={loading} // 6. Deshabilitar el botón mientras carga
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
};
export default LoginForm;
