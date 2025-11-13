import api from "./api";

export const obtenerUsuarios = async () => {
  const res = await api.get("/usuarios/ObtenerTodos");
  return res.data;
};


export const obtenerUsuarioPorEmail = async (email) => {
  const res = await api.get(`/usuarios/ObtenerPor/${email}`);
  return res.data;
};
