import { useState, useEffect } from "react";
import ExpenseForm from "../components/GastoForm";
import BudgetForm from "../components/PresupuestoForm";
import Dashboard from "../components/Dashboard";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function FinanzasPage() {
  const { user, updateUser } = useAuthStore();

  const [gastos, setGastos] = useState([]);
  const [presupuestos, setPresupuestos] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        let data = null;

        // Prefer fetching fresh data from API when possible
        if (user?.email) {
          const res = await api.get(`/usuarios/ObtenerPor/${user.email}`);
          data = res?.data?.usuario || res?.data || null;
        }

        // Fallback to the in-memory user (from store) or localStorage if API didn't return anything
        if (!data) data = user || {};

        const categorias = data.categorias || {};
        const pFor = (cat) =>
          categorias[cat]?.presupuestoInicial ?? categorias[cat]?.presupuesto ?? categorias[cat]?.presupuestoMensual ?? 0;

        const presupuestosBackend = {
          alimentacion: pFor("alimentacion"),
          transporte: pFor("transporte"),
          hogar: pFor("hogar"),
          otros: pFor("otros"),
        };

        // Gastos: prefer historial -> gastos -> movimientos dentro de categorias -> localStorage
        let gastosList = [];

        if (Array.isArray(data.historial) && data.historial.length > 0) {
          gastosList = data.historial.map((h) => ({
            id: h.id ?? h._id ?? `${Date.now()}-h-${Math.random()}`,
            nombre: h.descripcion ?? h.nombre ?? h.title ?? "",
            monto: Number(h.monto ?? h.valor ?? h.amount ?? 0) || 0,
            categoria: h.categoria ?? h.category ?? "",
            fecha: h.fecha ?? h.createdAt ?? new Date().toISOString(),
          }));
        } else if (Array.isArray(data.gastos) && data.gastos.length > 0) {
          gastosList = data.gastos.map((h) => ({
            id: h.id ?? h._id ?? `${Date.now()}-g-${Math.random()}`,
            nombre: h.descripcion ?? h.nombre ?? h.title ?? "",
            monto: Number(h.monto ?? h.valor ?? h.amount ?? 0) || 0,
            categoria: h.categoria ?? h.category ?? "",
            fecha: h.fecha ?? h.createdAt ?? new Date().toISOString(),
          }));
        } else {
          // buscar movimientos dentro de cada categoria
          Object.entries(categorias).forEach(([catKey, catVal]) => {
            const movimientos = (catVal && (catVal.movimientos || catVal.movimientosMensuales || [])) || [];
            if (!Array.isArray(movimientos)) return;
            movimientos.forEach((m, idx) => {
              gastosList.push({
                id: m.id ?? m._id ?? `${Date.now()}-${idx}`,
                nombre: m.descripcion ?? m.nombre ?? m.title ?? "",
                monto: Number(m.monto ?? m.valor ?? m.amount ?? 0) || 0,
                categoria: m.categoria ?? m.categoria_nombre ?? catVal.nombre ?? catKey,
                fecha: m.fecha ?? m.createdAt ?? new Date().toISOString(),
              });
            });
          });

          // si sigue vacío, leer desde storage
          if (gastosList.length === 0) {
            const gastosFromStorage = JSON.parse(localStorage.getItem("gastos") || "null");
            gastosList = gastosFromStorage ?? [];
          }
        }

        // Presupuestos: prefer computed backend -> localStorage
        const presFromStorage = JSON.parse(localStorage.getItem("presupuestos") || "null");
        const presFinal =
          Object.keys(presupuestosBackend).some((k) => presupuestosBackend[k] > 0)
            ? presupuestosBackend
            : presFromStorage || presupuestosBackend;

        setGastos(gastosList);
        setPresupuestos(presFinal || {});

        // persistir en localStorage para que otras pestañas/tiendas lo detecten
        try {
          localStorage.setItem("gastos", JSON.stringify(gastosList));
        } catch (e) {
          console.warn("No se pudo guardar gastos en localStorage:", e);
        }
        try {
          localStorage.setItem("presupuestos", JSON.stringify(presFinal || {}));
        } catch (e) {
          console.warn("No se pudo guardar presupuestos en localStorage:", e);
        }
      } catch (err) {
        console.error("Error cargando usuario:", err);
        // On error, try to recover from localStorage/user
        const fallbackGastos = JSON.parse(localStorage.getItem("gastos") || "[]");
        const fallbackPres = JSON.parse(localStorage.getItem("presupuestos") || "{}");
        setGastos(fallbackGastos);
        setPresupuestos(fallbackPres);
      }
    }

    loadData();
  }, [user]);

  const addGasto = async (gasto) => {
    // Validaciones en frontend: monto válido y existe presupuesto asignado
    const categoriaKey = (gasto.categoria || "").toLowerCase();
    const presupuestoCat = presupuestos[categoriaKey] ?? 0;
    const montoNum = Number(gasto.monto || 0);

    if (isNaN(montoNum) || montoNum <= 0) {
      alert("Ingresa un monto válido mayor que 0.");
      return;
    }

    if (!presupuestoCat || presupuestoCat <= 0) {
      alert("No hay presupuesto asignado para esta categoría. Asigna un presupuesto antes de registrar gastos.");
      return;
    }

    try {
      const res = await api.post(`/usuarios/${user.email}/gasto`, gasto);
      const nuevoGasto = res?.data?.movimiento ?? gasto;

      setGastos((prev) => {
        const updated = [...prev, nuevoGasto];
        try {
          localStorage.setItem("gastos", JSON.stringify(updated));
        } catch (e) {
          console.warn("No se pudo guardar gastos en localStorage:", e);
        }
        return updated;
      });
    } catch (err) {
      console.error("Error guardando gasto:", err);
      const msg = err?.response?.data?.detail || err.message || "Error al guardar gasto";
      alert(msg);
      setGastos((prev) => prev); // no change
    }
  };

  // 🗑 Eliminar gasto
  const eliminarGasto = async (id) => {
    try {
      await api.delete(`/usuarios/${user.email}/gasto/${id}`);
      setGastos((prev) => {
        const updated = prev.filter((g) => g.id !== id);
        try {
          localStorage.setItem("gastos", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } catch (err) {
      console.error("Error al eliminar:", err);
      // local fallback remove
      setGastos((prev) => {
        const updated = prev.filter((g) => g.id !== id);
        try {
          localStorage.setItem("gastos", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
  };

  const deshacerUltimoGasto = async (e) => {
    console.log("Parametros", e );
    
    if (!user?.email) return alert("Usuario no identificado");

    try {
      const res = await api.delete(`/usuarios/${user.email}/gasto/undo`);
      const movimiento = res?.data?.movimiento;

      // eliminar de la lista local si existe
      if (movimiento?.id) {
        setGastos((prev) => {
          const updated = prev.filter((g) => g.id !== movimiento.id);
          try {
            localStorage.setItem("gastos", JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
      }

      // refrescar usuario completo desde backend para actualizar presupuestos/saldos
      try {
        const full = await api.get(`/usuarios/ObtenerPor/${user.email}`);
        const data = full?.data?.usuario || full?.data || null;
        if (data) {
          updateUser(data);
          // también persistir en localStorage
          try {
            localStorage.setItem("user", JSON.stringify(data));
            
          } catch (e) {}
        }
      } catch (e) {
        // no bloquear si falla la recarga
        console.warn("No se pudo recargar usuario tras deshacer:", e);
      }

      alert(res?.data?.message || "Último gasto deshecho");
    } catch (err) {
      console.error("Error deshaciendo gasto:", err);
      const msg = err?.response?.data?.detail || err.message || "Error al deshacer gasto";
      alert(msg);
    }
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* NAVBAR */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 py-4">
              <div className="text-[#4F46E5]">
                <WalletIcon />
              </div>
              <h1 className="text-2xl font-extrabold dark:text-white">
                Smart<span className="text-[#4F46E5]">Budget</span>
              </h1>
            </Link>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 dark:text-gray-300"
              >
                {isOpen ? "✖" : "☰"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold dark:text-white mb-8">
          Panel de Finanzas de <span className="text-[#4F46E5]">{user.nombre}</span>
        </h1>

        {/* DASHBOARD */}
        <Dashboard
          gastos={gastos}
          presupuestos={presupuestos}
          ingresoMensual={user?.ingreso ?? user?.ingreso_mensual ?? user?.ingresoMensual ?? 0}
        />

        {/* FORMULARIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <ExpenseForm onAdd={addGasto} />
          <BudgetForm
            presupuestos={presupuestos}
            onSave={(categoria, monto) =>
              setPresupuestos((prev) => ({
                ...prev,
                [categoria.toLowerCase()]: monto,
              }))
            }
          />
        </div>

        {/* LISTA DE GASTOS */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Historial de Gastos</h2>
          <div className="flex justify-end mb-4">
            <button
              onClick={deshacerUltimoGasto}
              className= "w-full bg-indigo-600 text-white py-2 rounded"
            >
              Deshacer último gasto
            </button>
          </div>
            <div className="space-y-4">
            {gastos.length > 0 ? (
              gastos.map((g) => (
                <div
                  key={g.id}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded"
                >
                  <div>
                    <strong>{g.nombre}</strong>
                    <p className="text-sm text-gray-400">{g.categoria}</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="font-bold text-lg">
                      ${g.monto.toLocaleString()}
                    </span>
                    <button
                      onClick={() => eliminarGasto(g.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">
                No hay gastos registrados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
