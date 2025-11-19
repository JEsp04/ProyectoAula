import { useState, useEffect } from "react";
import ExpenseForm from "../components/GastoForm";
import BudgetForm from "../components/PresupuestoForm";
import Dashboard from "../components/Dashboard";
import {TrashIcon } from "@heroicons/react/24/solid";
import { useAuthStore } from "../store/useAuthStore";
  import {Link } from "react-router-dom";

export default function FinanzasPage() {
  const [gastos, setGastos] = useState(
    JSON.parse(localStorage.getItem("gastos")) || []
  );

  const [presupuestos, setPresupuestos] = useState(
    JSON.parse(localStorage.getItem("presupuestos")) || {}
  );

  const { user, updateUser } = useAuthStore();

  // sincroniza estado con localStorage (al montar y cuando cambie desde login/store)
  useEffect(() => {
    const loadFromStorage = () => {
      setGastos(JSON.parse(localStorage.getItem("gastos")) || []);
      setPresupuestos(JSON.parse(localStorage.getItem("presupuestos")) || {});
    };

    // cargar al montar
    loadFromStorage();

    // "storage" se dispara desde otras pestañas; "user:sync" lo usaremos desde el store en la misma pestaña
    const onStorage = (e) => {
      if (!e.key || e.key === "gastos" || e.key === "presupuestos") loadFromStorage();
    };
    const onUserSync = () => loadFromStorage();

    window.addEventListener("storage", onStorage);
    window.addEventListener("user:sync", onUserSync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("user:sync", onUserSync);
    };
  }, []);

  // Guardar gastos en localStorage
  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  const addGasto = (gasto) => {
    setGastos([...gastos, gasto]);
  };

  const eliminarGasto = (id) => {
    setGastos(gastos.filter((g) => g.id !== id));
  };

  const handleUpdateIngreso = (nuevoIngreso) => {
    // Llama a una función en el store para actualizar el usuario
    updateUser({ ...user, ingreso: nuevoIngreso });
  };

  const WalletIcon = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    );
    
    const [isOpen, setIsOpen] = useState(false);
    

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

        <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              {/* Logo y Nombre de la App */}
              <Link to="/" className="flex items-center gap-2 py-4">
                <div className="text-[#4F46E5]">
                  <WalletIcon />
                </div>
                <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">
                  Smart<span className="text-[#4F46E5]">Budget</span>
                </h1>
              </Link>
    
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-4">
                <Link to="/" className="text-gray-600 dark:text-gray-300 font-medium hover:text-[#4F46E5] dark:hover:text-blue-400 px-3 py-2 rounded-md transition-colors duration-300">
                  Inicio
                </Link>
                <button
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                  aria-label="Toggle Dark Mode"
                >
                </button>
              </div>
    
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  className="p-2 mr-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                  aria-label="Toggle Dark Mode"
                >
                </button>
                <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-gray-300 hover:text-[#4F46E5] focus:outline-none" aria-label="Toggle Menu">
                  {isOpen ? (
                    // Icono de X (cerrar)
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  ) : (
                    // Icono de hamburguesa
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
    
          {/* Mobile Menu (desplegable) */}
          <div className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200 dark:border-gray-700`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#4F46E5] block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Inicio</Link>
              
            </div>
          </div>
        </nav>
    
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white mb-8">
        Panel de Finanzas
      </h1>
      <Dashboard
        gastos={gastos}
        presupuestos={presupuestos}
        ingresoMensual={user?.ingreso || 0}
        onUpdateIngreso={handleUpdateIngreso}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        <ExpenseForm onAdd={addGasto} />
        <BudgetForm
          presupuestos={presupuestos}
          setPresupuestos={setPresupuestos}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4">Historial de Gastos</h2>
        <div className="space-y-4">
          {gastos.length > 0 ? (
            gastos.map((g) => (
              <div key={g.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div>
                  <strong className="font-semibold text-lg">{g.nombre}</strong>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{g.categoria}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg">${g.monto.toLocaleString()}</span>
                  <button onClick={() => eliminarGasto(g.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-full transition-colors">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No hay gastos registrados todavía.</p>
          )}
        </div>
      </div>
    </div>
    </div>
    );
}
