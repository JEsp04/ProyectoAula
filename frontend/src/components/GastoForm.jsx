import { useState } from "react";

export default function GastoForm({ onAdd }) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Alimentacion");
  const [monto, setMonto] = useState("");

  const enviar = (e) => {
    e.preventDefault();

    onAdd({
      descripcion: nombre,
      categoria,
      monto: Number(monto),
    });

    setNombre("");
    setMonto("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Registrar Gasto</h2>

      <form onSubmit={enviar}>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option>Alimentacion</option>
          <option>Transporte</option>
          <option>Hogar</option>
          <option>Otros</option>
        </select>

        <input
          type="text"
          placeholder="Descripción del gasto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Añadir Gasto
        </button>
      </form>
    </div>
  );
}
