import { create } from "zustand";
import { getExpenses, createExpense } from "../services/expenseService";

export const useExpenseStore = create((set) => ({
  expenses: [],
  categories: [],
  loading: false,
  error: null,

  fetchExpenses: async () => {
    set({ loading: true });
    try {
      const expenses = await getExpenses();
      set({ expenses, loading: false });
    } catch (err) {
      set({ error: "Error al obtener gastos", loading: false });
    }
  },

  addExpense: async (expense) => {
    set({ loading: true });
    try {
      // crear en backend y luego refetchear la lista para mantener consistencia
      await createExpense(expense);
      const expenses = await getExpenses();
      set({ expenses, loading: false });
    } catch (err) {
      set({ error: "Error al crear gasto", loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      // si tienes endpoint para categorías, implementa getCategories y úsalo aquí
      // const categories = await getCategories();
      // set({ categories });
    } catch (err) {
      set({ error: "Error al obtener categorías" });
    }
  },
}));
