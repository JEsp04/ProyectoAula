import { useState, useEffect } from "react";

export default function Notificacion({
  alertas = [],
  anchor = false,
  showEmpty = false,
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    // Asegurar que alertas siempre sea un array limpio de strings
    const list = Array.isArray(alertas)
      ? alertas.map((a) => (typeof a === "string" ? a : a?.mensaje || ""))
      : [];

    setVisible(list);

    try {
      console.debug("Notificacion - alertas recibidas:", list);
    } catch (e) {}
  }, [alertas]);

  // Si no está anclado y no debe mostrar vacío → ocultar
  if (!anchor && !showEmpty && (!visible || visible.length === 0)) return null;

  const containerClass = anchor
    ? "absolute right-0 mt-3 w-80 space-y-2 z-40"
    : "fixed right-4 top-20 z-50 w-96 space-y-3";

  return (
    <div className={containerClass}>
      {visible && visible.length > 0 ? (
        visible.map((a, idx) => (
          <div
            key={`${a}-${idx}`}
            className="bg-white dark:bg-gray-800 border-l-4 border-[#4F46E5] shadow p-3 rounded-md flex justify-between items-start gap-4"
            role="status"
            aria-live="polite"
          >
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Alerta
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {a}
              </p>
            </div>
          </div>
        ))
      ) : (
        showEmpty && (
          <div className="bg-white dark:bg-gray-800 shadow p-3 rounded-md text-center text-sm text-gray-600 dark:text-gray-300">
            No hay alertas.
          </div>
        )
      )}
    </div>
  );
}
