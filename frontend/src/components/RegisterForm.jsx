import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  useEffect(() => {
    useAuthStore.getState().logout();
  }, []);

  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  const [form, setForm] = useState({ nombre: "", email: "", ingreso_mensual: "", password: "" });
 

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, email, ingreso_mensual, password } = form;
    try {
      await register({ nombre, email, ingreso_mensual, password });
      navigate("/dashboard"); 
    } catch (err) {
      console.error(err); 
    }
  };

  return (

    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 shadow-lg rounded-lg w-full max-w-sm mx-auto mt-10 transition-colors duration-300">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">Registro</h2>

      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none" required />

      <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none" required />

      <input name="ingreso_mensual" type="number" placeholder="Ingreso mensual" value={form.ingreso_mensual} onChange={handleChange} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none" required />

      <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none" required />
      
      {error && <p className="text-red-500 text-sm text-center mt-5">{error}</p>}

     <button 
        type="submit"
        className="bg-[#4F46E5] text-white py-2 px-4 rounded w-full hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-400"
        disabled={loading} // 6. Deshabilitar el botón mientras carga
      >
        {loading ? "Registrando..." : "Registrarse"}
      </button>
      

    </form>
  );
};

export default RegisterForm;
