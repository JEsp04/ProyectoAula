import api from "./api";


export const createExpense = async (email, data) => {
  const res = await api.post('/usuarios/${email}/gasto', data);
  return res.data;
};

