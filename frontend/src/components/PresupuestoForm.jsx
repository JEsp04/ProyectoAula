import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const categorias = ["Alimentacion", "Transporte", "Hogar", "Otros"];

export default function BudgetForm({ presupuestos: initialPresupuestos }) {
  const [categoria, setCategoria] = useState(categorias[0]);
  const [monto, setMonto] = useState("");
  const { user, updateUser } = useAuthStore();

  const guardarPresupuesto = async (e) => {
    e.preventDefault();
    if (!monto) return alert("Ingresa un presupuesto válido");

    const categoriaNormalizada = categoria.toLowerCase();

    // Actualizamos la categoría correspondiente en el objeto de usuario del store
    const updatedCategories = {
      ...user.categorias,
      [categoriaNormalizada]: {
        ...(user.categorias?.[categoriaNormalizada] || {}),
        presupuestoMensual: Number(monto),
      },
    };

    // Llamamos a la acción del store para que actualice el estado global y localStorage
    await updateUser({ ...user, categorias: updatedCategories });

    setMonto("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Definir Presupuesto</h2>

      <form onSubmit={guardarPresupuesto}>
        <div className="space-y-4">
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 outline-none">
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input type="number" placeholder="Monto del presupuesto" value={monto} onChange={(e) => setMonto(e.target.value)} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <button type="submit" className="mt-4 bg-[#4F46E5] text-white py-2 px-4 rounded w-full hover:bg-blue-600 transition-colors duration-300">
          Guardar Presupuesto
        </button>
      </form>
    </div>
  );
}
