import React, { useState } from "react";
import { useUserStore } from "../store/userStore";

const LoginForm = () => {
  const { login } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
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
      <button className="bg-[#4F46E5] text-white py-2 px-4 rounded w-full hover:bg-blue-600 transition-colors duration-300">
        Entrar
      </button>
    </form>
  );
};

export default LoginForm;
