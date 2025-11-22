import { useState, useMemo } from "react";
import { CATEGORIAS } from "../utils/categorias";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import CategoryTree from "./CategoryTree";

export default function Dashboard({
  gastos = [],
  presupuestos = {},
  ingresoMensual = 0,
  onUpdateIngreso,
  arbolGeneral = {},
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newIngreso, setNewIngreso] = useState(String(ingresoMensual));
  const [openCat, setOpenCat] = useState(null);

  const normalize = (s) =>
    s
      ? String(s)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      : "";

  const arbolIndexado = useMemo(() => {
    if (!arbolGeneral || !arbolGeneral.children) return {};
    const indexado = {};

    arbolGeneral.children.forEach((cat) => {
      indexado[normalize(cat.name)] = cat;
    });

    return indexado;
  }, [arbolGeneral]);

  const totalAsignado = Object.values(presupuestos).reduce(
    (sum, p) => sum + Number(p || 0),
    0
  );

  const totalGastado = gastos.reduce((sum, g) => sum + Number(g.monto || 0), 0);

  const saldoGeneral = ingresoMensual - totalAsignado;

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
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Resumen Financiero
      </h2>

      {/* RESUMEN GENERAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 border-b dark:border-gray-700 pb-6">
        {/* INGRESO */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm text-center">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Ingreso Mensual
          </h4>

          {isEditing ? (
            <div className="flex items-center justify-center gap-2 mt-1">
              <input
                type="number"
                value={newIngreso}
                onChange={(e) => setNewIngreso(e.target.value)}
                className="text-lg font-bold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded w-full p-2 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveIngreso}
                className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-gray-600 rounded-full"
              >
                <CheckIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-gray-600 rounded-full"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <p
              onClick={() => setIsEditing(true)}
              className="text-2xl font-bold text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              ${ingresoMensual.toLocaleString()}
            </p>
          )}
        </div>

        {/* TOTAL GASTADO */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm text-center">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Gastado
          </h4>
          <p className="text-2xl font-bold text-red-500 dark:text-red-400">
            ${totalGastado.toLocaleString()}
          </p>
        </div>

        {/* SALDO */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm text-center">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Saldo Por Asignar
          </h4>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${saldoGeneral.toLocaleString()}
          </p>
        </div>
      </div>

      {/* TARJETAS DE CATEGORÍAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIAS.map((cat) => {
          const catNorm = normalize(cat);

          const gastado = gastos
            .filter((g) => normalize(g.categoria) === catNorm)
            .reduce((s, g) => s + Number(g.monto || 0), 0);

          const presupuesto = presupuestos[catNorm] || 0;
          const restante = presupuesto - gastado;

          const porcentaje =
            presupuesto > 0
              ? Math.min(100, Math.round((gastado / presupuesto) * 100))
              : 0;

          const nodoFinal = {
            ...arbolIndexado[catNorm],
            presupuesto,
            gastos: gastado,
          };

          // Fallback: si el nodo no trae movimientos, rellenarlos desde el listado plano `gastos`
          if (!nodoFinal || !Array.isArray(nodoFinal.movimientos) || nodoFinal.movimientos.length === 0) {
            const movimientosFromGastos = gastos
              .filter((g) => normalize(g.categoria) === catNorm)
              .map((m) => ({
                id: m.id,
                descripcion: m.nombre || m.descripcion || "Gasto",
                monto: Number(m.monto || 0),
                fecha: m.fecha,
              }));
            nodoFinal.movimientos = movimientosFromGastos;
          }

          // Ensure children array exists
          if (!nodoFinal.children) nodoFinal.children = [];

          return (
            <div
              key={cat}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
            >
              <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">
                {cat}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Presupuesto:{" "}
                <span className="font-medium">
                  ${presupuesto.toLocaleString()}
                </span>
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gastado:{" "}
                <span className="font-medium">${gastado.toLocaleString()}</span>
              </p>

              <p
                className={`text-sm font-semibold ${
                  restante >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                Saldo Restante: ${restante.toLocaleString()}
              </p>

              {/* BARRA */}
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-2">
                <div
                  className={`h-2.5 rounded-full ${
                    porcentaje > 80 ? "bg-red-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>

              {/* BOTÓN HISTORIAL */}
              <button
                onClick={() =>
                  setOpenCat((prev) => {
                    const next = prev === catNorm ? null : catNorm;
                    try {
                      console.debug(
                        "Dashboard - openCat click",
                        catNorm,
                        "nodoFinal:",
                        nodoFinal
                      );
                    } catch (e) {}
                    return next;
                  })
                }
                className="mt-3 text-sm px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 w-full"
              >
                {openCat === catNorm ? "Ocultar historial" : "Ver historial"}
              </button>

              {openCat === catNorm && (
                <div className="mt-4 p-2 bg-white dark:bg-gray-800 rounded">
                  <CategoryTree tree={nodoFinal} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
