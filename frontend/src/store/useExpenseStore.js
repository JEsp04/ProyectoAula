import { create } from "zustand";
import { createExpense } from "../services/expenseService";

export const useExpenseStore = create((set, get) => {
  // Inicializar desde localStorage
  const initial = (() => {
    try {
      return JSON.parse(localStorage.getItem("gastos") || "[]");
    } catch (e) {
      console.warn("useExpenseStore: error parsing gastos from localStorage", e);
      return [];
    }
  })();

  // Registrar listeners para sincronizar entre pestañas y cuando el user se sincroniza
  if (typeof window !== "undefined") {
    const onSync = (e) => {
      // e may be a StorageEvent or a custom Event without key
      const key = e?.key ?? null;
      if (key === null || key === "gastos") {
        try {
          const gastos = JSON.parse(localStorage.getItem("gastos") || "[]");
          set({ expenses: gastos });
        } catch (err) {
          console.warn("useExpenseStore: failed to parse gastos on sync", err);
        }
      }
    };

    window.addEventListener("storage", onSync);
    window.addEventListener("user:sync", onSync);
  }

  return {
    expenses: initial,
    loading: false,
    error: null,

    addExpense: async (expense) => {
      set({ loading: true });

      try {
        const nuevoGasto = await createExpense(expense);

        // agregarlo a la lista actual
        const updated = [...get().expenses, nuevoGasto];

        // guardar en localStorage
        try {
          localStorage.setItem("gastos", JSON.stringify(updated));
        } catch (e) {
          console.warn("useExpenseStore: could not save gastos to localStorage", e);
        }

        set({ expenses: updated, loading: false });

      } catch (err) {
        console.error(err);
        set({ error: "Error al crear gasto", loading: false });
      }
    },
  };
});
