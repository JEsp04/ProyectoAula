import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ExpenseForm from "../components/GastoForm";
import BudgetForm from "../components/PresupuestoForm";
import Dashboard from "../components/Dashboard";
import Notificacion from "../components/Notificacion";
import CategoryTree from "../components/CategoryTree";
import { TrashIcon, BellIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function FinanzasPage() {
  const { user, updateUser, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [gastos, setGastos] = useState([]);
  const [presupuestos, setPresupuestos] = useState({});
  const [categoryTree, setCategoryTree] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const prevAlertCount = useRef(0);

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
          categorias[cat]?.presupuestoInicial ??
          categorias[cat]?.presupuesto ??
          categorias[cat]?.presupuestoMensual ??
          0;

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
            const movimientos =
              (catVal &&
                (catVal.movimientos || catVal.movimientosMensuales || [])) ||
              [];
            if (!Array.isArray(movimientos)) return;
            movimientos.forEach((m, idx) => {
              gastosList.push({
                id: m.id ?? m._id ?? `${Date.now()}-${idx}`,
                nombre: m.descripcion ?? m.nombre ?? m.title ?? "",
                monto: Number(m.monto ?? m.valor ?? m.amount ?? 0) || 0,
                categoria:
                  m.categoria ?? m.categoria_nombre ?? catVal.nombre ?? catKey,
                fecha: m.fecha ?? m.createdAt ?? new Date().toISOString(),
              });
            });
          });

          // si sigue vacío, leer desde storage
          if (gastosList.length === 0) {
            const gastosFromStorage = JSON.parse(
              localStorage.getItem("gastos") || "null"
            );
            gastosList = gastosFromStorage ?? [];
          }
        }

        // Presupuestos: prefer computed backend -> localStorage
        const presFromStorage = JSON.parse(
          localStorage.getItem("presupuestos") || "null"
        );
        const presFinal = Object.keys(presupuestosBackend).some(
          (k) => presupuestosBackend[k] > 0
        )
          ? presupuestosBackend
          : presFromStorage || presupuestosBackend;

        setGastos(gastosList);
        setPresupuestos(presFinal || {});
        // Alertas desde backend (si vienen)
        try {
          const dismissed = JSON.parse(
            localStorage.getItem("dismissedAlertas") || "[]"
          );
          const incoming = Array.isArray(data.alertas) ? data.alertas : [];
          const filtered = incoming.filter((a) => !dismissed.includes(a));
          // debug
          try {
            console.debug(
              "FinanzasPage - incoming alertas:",
              incoming,
              "dismissed:",
              dismissed,
              "filtered:",
              filtered
            );
          } catch (e) {}
          setAlertas(filtered);
          // persist raw alerts for debugging/fallback
          try {
            localStorage.setItem("alertas", JSON.stringify(incoming));
            try {
              window.dispatchEvent(new Event("user:sync"));
            } catch (e) {}
          } catch (e) {}
        } catch (e) {
          setAlertas(Array.isArray(data.alertas) ? data.alertas : []);
        }

        // Categorias en forma de árbol (si el backend lo provee)
        try {
          if (data && data.categorias_arbol) {
            setCategoryTree(data.categorias_arbol);
            try {
              localStorage.setItem(
                "categorias_arbol",
                JSON.stringify(data.categorias_arbol)
              );
            } catch (e) {}
          } else {
            const stored = JSON.parse(
              localStorage.getItem("categorias_arbol") || "null"
            );
            if (stored) setCategoryTree(stored);
          }
        } catch (e) {
          console.debug("no category tree in response", e);
        }

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
        const fallbackGastos = JSON.parse(
          localStorage.getItem("gastos") || "[]"
        );
        const fallbackPres = JSON.parse(
          localStorage.getItem("presupuestos") || "{}"
        );
        setGastos(fallbackGastos);
        setPresupuestos(fallbackPres);
        // si hubo error, intentar recuperar alertas de localStorage
        try {
          const dismissed = JSON.parse(
            localStorage.getItem("dismissedAlertas") || "[]"
          );
          const stored =
            JSON.parse(localStorage.getItem("alertas") || "null") || [];
          setAlertas((stored || []).filter((a) => !dismissed.includes(a)));
        } catch (e) {
          setAlertas([]);
        }
      }
    }

    loadData();
  }, [user]);

  // Debug: log and expose categoryTree for quick console inspection
  useEffect(() => {
    try {
      console.debug("FinanzasPage - categoryTree updated:", categoryTree);
    } catch (e) {}
    try {
      // expose to window for debugging in the browser console
      window.__categoryTree = categoryTree;
    } catch (e) {}
  }, [categoryTree]);

  // Listen for changes to alerts in this tab (custom event) or other tabs (storage)
  useEffect(() => {
    const refreshFromStorage = () => {
      try {
        const raw = JSON.parse(localStorage.getItem("alertas") || "null") || [];
        const dismissed =
          JSON.parse(localStorage.getItem("dismissedAlertas") || "[]") || [];
        const filtered = (Array.isArray(raw) ? raw : []).filter(
          (a) => !dismissed.includes(a)
        );
        // show panel if new alerts arrived
        if (filtered.length > (prevAlertCount.current || 0)) {
          setShowAlertPanel(true);
        }
        setAlertas(filtered);
      } catch (e) {
        console.debug("refreshFromStorage error", e);
      }
    };

    const onUserSync = () => refreshFromStorage();
    const onStorage = (ev) => {
      if (!ev) return;
      if (ev.key === "alertas" || ev.key === "dismissedAlertas") {
        refreshFromStorage();
      }
    };

    window.addEventListener("user:sync", onUserSync);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("user:sync", onUserSync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // keep ref in sync with current alert count
  useEffect(() => {
    prevAlertCount.current = Array.isArray(alertas) ? alertas.length : 0;
  }, [alertas]);

  const addGasto = async (gasto) => {
    const categoriaKey = (gasto.categoria || "").toLowerCase();
    const presupuestoCat = presupuestos[categoriaKey] ?? 0;
    const montoNum = Number(gasto.monto || 0);

    if (isNaN(montoNum) || montoNum <= 0) {
      alert("Ingresa un monto válido mayor que 0.");
      return;
    }

    if (!presupuestoCat || presupuestoCat <= 0) {
      alert("No hay presupuesto asignado para esta categoría.");
      return;
    }

    try {
      // Registrar gasto
      const res = await api.post(`/usuarios/${user.email}/gasto`, gasto);

      const movimiento = res?.data?.movimiento ?? gasto;

      const normalized = {
        id: movimiento.id ?? movimiento._id ?? `${Date.now()}-${Math.random()}`,
        nombre:
          movimiento.descripcion ??
          movimiento.nombre ??
          movimiento.title ??
          gasto.nombre ??
          "",
        monto:
          Number(
            movimiento.monto ??
              movimiento.valor ??
              movimiento.amount ??
              gasto.monto
          ) || 0,
        categoria:
          movimiento.categoria ?? movimiento.category ?? gasto.categoria ?? "",
        fecha:
          movimiento.fecha ?? movimiento.createdAt ?? new Date().toISOString(),
      };

      // 1️⃣ Actualizar lista local de gastos
      setGastos((prev) => {
        const updated = [...prev, normalized];
        localStorage.setItem("gastos", JSON.stringify(updated));
        return updated;
      });

      // 2️⃣ Obtener usuario ACTUALIZADO desde backend (aquí vienen las alertas nuevas)
      const resUser = await api.get(`/usuarios/ObtenerPor/${user.email}`);
      const updatedUser = resUser.data.usuario || resUser.data;

      // 3️⃣ Guardar y propagar usuario actualizado
      localStorage.setItem("user", JSON.stringify(updatedUser));
      updateUser(updatedUser); // 🔥 fuerza render + dispara useEffect de FinanzasPage

      // Actualizar árbol de categorías inmediatamente si viene en la respuesta
      try {
        if (updatedUser && updatedUser.categorias_arbol) {
          setCategoryTree(updatedUser.categorias_arbol);
          localStorage.setItem(
            "categorias_arbol",
            JSON.stringify(updatedUser.categorias_arbol)
          );
          try {
            window.dispatchEvent(new Event("user:sync"));
          } catch (e) {}
        }
      } catch (e) {
        console.debug("no categorias_arbol on updatedUser", e);
      }

      // 4️⃣ Cargar alertas desde updatedUser y mostrarlas
      const incomingAlerts = Array.isArray(updatedUser.alertas)
        ? updatedUser.alertas
        : [];

      const dismissed = JSON.parse(
        localStorage.getItem("dismissedAlertas") || "[]"
      );

      const filtered = incomingAlerts.filter((a) => !dismissed.includes(a));

      localStorage.setItem("alertas", JSON.stringify(incomingAlerts));
      setAlertas(filtered);

      if (filtered.length > 0) setShowAlertPanel(true);
    } catch (err) {
      console.error("Error guardando gasto:", err);
      const msg =
        err?.response?.data?.detail || err.message || "Error al guardar gasto";
      alert(msg);
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
      const resUser = await api.get(`/usuarios/ObtenerPor/${user.email}`);
      const updatedUser = resUser.data.usuario || resUser.data;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      updateUser(updatedUser);
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
            <Link to="/dashboard" className="flex items-center gap-2 py-4">
              <div className="text-[#4F46E5]">
                <WalletIcon />
              </div>
              <h1 className="text-2xl font-extrabold dark:text-white">
                Smart<span className="text-[#4F46E5]">Budget</span>
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              {/* Bell / Alertas (dropdown anclado con animación) */}
              <div className="relative">
                <button
                  onClick={() => setShowAlertPanel((s) => !s)}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Ver alertas"
                >
                  <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  {alertas && alertas.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {alertas.length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showAlertPanel && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 mt-3 z-40"
                    >
                      <Notificacion alertas={alertas} anchor={true} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Usuario */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((s) => !s)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Cuenta de usuario"
                >
                  <UserCircleIcon className="h-8 w-8 text-gray-600 dark:text-gray-200" />
                </button>

                {userMenuOpen && (
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-3 bg-white shadow-xl rounded-xl p-4 w-56 border border-gray-100 dark:bg-gray-800 dark:border-gray-700 z-40"
                      >
                        {!isAuthenticated ? (
                          <Link
                            to="/Autenticacion"
                            className="block text-center text-gray-700 hover:text-black font-semibold"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Iniciar sesión
                          </Link>
                        ) : (
                          <>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">
                              {user?.nombre}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              {user?.email}
                            </p>

                            <div className="h-px bg-gray-200 my-3 dark:bg-gray-700" />

                            <button
                              onClick={() => {
                                try {
                                  logout();
                                } catch (e) {}
                                setUserMenuOpen(false);
                                navigate("/");
                              }}
                              className="block w-full text-left text-red-500 hover:text-red-700 font-semibold"
                            >
                              Cerrar sesión
                            </button>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>
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
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold dark:text-white mb-4">
              Panel de Finanzas de{" "}
              <span className="text-[#4F46E5]">{user.nombre}</span>
            </h1>
          </div>

          <div className="w-96 hidden lg:block">
            {/* espacio para posibles widgets laterales (mantiene diseño) */}
          </div>
        </div>

        {/* DASHBOARD */}
        <Dashboard
          gastos={gastos}
          presupuestos={presupuestos}
          ingresoMensual={
            user?.ingreso ?? user?.ingreso_mensual ?? user?.ingresoMensual ?? 0
          }
          arbolGeneral={categoryTree}
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
          <div className="flex justify-end mb-4"></div>
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
