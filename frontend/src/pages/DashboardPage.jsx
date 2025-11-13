import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const { user } = useAuthStore((state) => state);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bienvenido a tu Dashboard, {user?.nombre || "Usuario"}</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Aquí podrás gestionar tus presupuestos y gastos.</p>
      </div>
    </div>
  );
};

export default DashboardPage;