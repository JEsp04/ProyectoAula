import api from "./api";

export const getExpenses = async () => {
  const { data } = await api.get("/gastos");
  return data;
};

export const createExpense = async (expense) => {
  const { data } = await api.post("/gastos", expense);
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get("/categorias");
  return data;
};
