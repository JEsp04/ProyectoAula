import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const RegisterForm = () => {
  useEffect(() => {
    useAuthStore.getState().logout();
  }, []);
  const { register, error } = useAuthStore();
  const [form, setForm] = useState({ nombre: "", email: "", ingreso_mensual: "", password: "" });
  
 

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    register({
      nombre: form.nombre,
      email: form.email,
      ingreso_mensual: Number(form.ingreso_mensual) || 0,
      password: form.password,
    }
    );
  };

  return (

    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 shadow-lg rounded-lg w-full max-w-sm mx-auto mt-10 transition-colors duration-300">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">Registro</h2>

      <input name="nombre" placeholder="Nombre" value={form.name} onChange={handleChange} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none" required />

      <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none" required />

      <input name="ingreso_mensual" type="number" placeholder="Ingreso mensual" value={form.ingreso_mensual} onChange={handleChange} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none" required />

      <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none" required />

      <button className="bg-[#4F46E5] text-white py-2 px-4 rounded w-full hover:bg-blue-600 transition-colors duration-300">Registrarse</button>
      
      {error && <p className="text-red-500 text-sm text-center mt-5">{error}</p>}

    </form>
  );
};

export default RegisterForm;
