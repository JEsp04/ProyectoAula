import { useState } from "react";
import { CATEGORIAS } from "../utils/categorias";
import { useExpenseStore } from "../store/useExpenseStore";

export default function ExpenseForm() {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const addExpense = useExpenseStore((state) => state.addExpense);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !monto) return alert("Ingresa todos los datos");

    try {
      await addExpense({
        nombre,
        monto: Number(monto),
        categoria,
      });
      // Limpiar el formulario en caso de éxito
      setNombre("");
      setMonto("");
    } catch (error) {
      alert("Error al añadir el gasto. Inténtalo de nuevo.");
    }

    setNombre("");
    setMonto("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Añadir Gasto</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Nombre del gasto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />

        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none transition">
          {CATEGORIAS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <button type="submit" className="bg-[#4F46E5] text-white font-bold py-3 px-4 rounded-lg w-full hover:bg-blue-600 transition-colors duration-300 shadow-md">Añadir Gasto</button>
      </form>
    </div>
  );
}
