import { useState } from "react";
import { CATEGORIAS } from "../utils/categorias";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Dashboard({
  gastos = [],
  presupuestos = {},
  ingresoMensual = 0,
  onUpdateIngreso,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newIngreso, setNewIngreso] = useState(String(ingresoMensual));

  const totalAsignado = Object.values(presupuestos).reduce((sum, p) => sum + Number(p || 0), 0);
  const totalGastado = gastos.reduce((sum, g) => sum + Number(g.monto || 0), 0);
  const saldoGeneral = ingresoMensual - totalAsignado;

  const normalize = (s) =>
    s
      ? String(s)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      : "";

  const handleSaveIngreso = () => {
    const monto = Number(newIngreso);
    if (!isNaN(monto) && monto >= 0) {
      onUpdateIngreso(monto);
      setIsEditing(false);
    } else {
      alert("Por favor, ingresa un monto válido.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Resumen Financiero</h2>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 border-b dark:border-gray-700 pb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm text-center">
          <div className="flex justify-center items-center gap-2">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingreso Mensual</h4>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-500 transition-colors">
                <PencilIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="flex items-center justify-center gap-2 mt-1">
              <input type="number" value={newIngreso} onChange={(e) => setNewIngreso(e.target.value)} className="text-lg font-bold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 text-center focus:ring-2 focus:ring-blue-500 outline-none" autoFocus />
              <button onClick={handleSaveIngreso} className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-gray-600 rounded-full"><CheckIcon className="h-5 w-5" /></button>
              <button onClick={() => setIsEditing(false)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-gray-600 rounded-full"><XMarkIcon className="h-5 w-5" /></button>
            </div>
          ) : (
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">${ingresoMensual.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm text-center">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Gastado</h4>
          <p className="text-2xl font-bold text-red-500 dark:text-red-400">${totalGastado.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm text-center">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Por Asignar</h4>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">${saldoGeneral.toLocaleString()}</p>
        </div>
      </div>

      {/* Resumen por Categorías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIAS.map((cat) => {
          const catNorm = normalize(cat);
          const gastado = gastos
            .filter((g) => normalize(g.categoria) === catNorm)
            .reduce((s, g) => s + Number(g.monto || 0), 0);

          const presupuesto = presupuestos[catNorm] || 0;
          const restante = presupuesto - gastado;
          const porcentaje = presupuesto > 0 ? Math.min(100, Math.round((gastado / presupuesto) * 100)) : 0;

          return (
            <div key={cat} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">{cat}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Presupuesto: <span className="font-medium">${presupuesto.toLocaleString()}</span></p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gastado: <span className="font-medium">${gastado.toLocaleString()}</span></p>
              <p className={`text-sm font-semibold ${restante >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                Saldo Restante: ${restante.toLocaleString()}
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-2">
                <div
                  className={`h-2.5 rounded-full ${porcentaje > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
