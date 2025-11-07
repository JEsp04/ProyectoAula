import { create } from "zustand";
import { getExpenses, createExpense, getCategories } from "../services/expenseService";

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
      const newExpense = await createExpense(expense);
      set((state) => ({
        expenses: [...state.expenses, newExpense],
        loading: false,
      }));
    } catch (err) {
      set({ error: "Error al crear gasto", loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await getCategories();
      set({ categories });
    } catch (err) {
      set({ error: "Error al obtener categorías" });
    }
  },
}));
