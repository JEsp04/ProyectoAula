import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/solid";
import api from "../services/api";
import { useAuthStore } from "../store/useAuthStore";

function ProgressBar({ value = 0 }) {
  const num = Number(value);
  const pct = Number.isFinite(num)
    ? Math.min(100, Math.max(0, Math.round(num)))
    : 0;

  const innerStyle = {
    width: `${pct}%`,
    minWidth: pct > 0 && pct < 4 ? "6px" : undefined,
    background: "linear-gradient(90deg,#4F46E5,#6366F1)",
  };

  return (
    <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-3 w-36 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="h-3 rounded-full" style={innerStyle} aria-hidden />
      <span className="sr-only">{pct}%</span>
    </div>
  );
}

//  👉 CORRECTO: eliminarGasto fuera del ProgressBar
async function eliminarGasto(id, user, setGastos, updateUser) {
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
  }
}

function Node({ node, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  // Auth store - use separate selectors to avoid returning a new object each render
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const setGastos = (fn) => {
    const prev = JSON.parse(localStorage.getItem("gastos") || "[]");
    const updated = fn(prev);
    localStorage.setItem("gastos", JSON.stringify(updated));
  };

  const presupuesto = Number(node.presupuesto || 0);
  const gastos = Number(node.gastos || 0);
  const pct = presupuesto > 0 ? (gastos / presupuesto) * 100 : 0;

  return (
    <div className="border rounded-md bg-white dark:bg-gray-800 p-3">
      <div className="flex justify-between items-center">
        <span className="font-semibold">{node.name}</span>
        <ProgressBar value={pct} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pl-6 space-y-2"
          >
            {node.children?.map((c, i) => (
              <Node key={i} node={c} />
            ))}

            {node.movimientos?.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                <div>
                  <div className="text-sm font-medium">{m.descripcion}</div>
                  <div className="text-xs text-gray-500">{m.fecha}</div>
                </div>

                <div className="font-bold">
                  ${Number(m.monto).toLocaleString()}
                </div>

                {/*  👉 Corrección: m.id y función accesible */}
                <button
                  onClick={() =>
                    eliminarGasto(m.id, user, setGastos, updateUser)
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}

            {!node.children?.length && !node.movimientos?.length && (
              <div className="text-sm text-gray-500">Sin historial.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CategoryTree({ tree }) {
  if (!tree) return null;

  return (
    <div className="space-y-3">
      <Node node={tree} defaultOpen={true} />
    </div>
  );
}
