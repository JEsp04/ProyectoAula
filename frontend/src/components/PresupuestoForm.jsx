import { useState } from "react";
import api from "../services/api";
import { useAuthStore } from "../store/useAuthStore";

const categorias = ["Alimentacion", "Transporte", "Hogar", "Otros"];

export default function PresupuestoForm({ presupuestos, onSave }) {
  const [categoria, setCategoria] = useState(categorias[0]);
  const [monto, setMonto] = useState("");
  const { user } = useAuthStore();

  const guardarPresupuesto = async (e) => {
    e.preventDefault();
    if (!monto) return;

    await api.post(`/usuarios/${user.email}/presupuesto`, {
      categoria,
      monto: Number(monto),
    });

    onSave(categoria, Number(monto));
    setMonto("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Definir Presupuesto</h2>

      <form onSubmit={guardarPresupuesto}>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          {categorias.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button className="w-full bg-indigo-600 text-white py-2 mt-4 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
