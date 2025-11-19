import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FinanzasPage from "./pages/FinanzasPage"; // 1. Importar la nueva página

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<FinanzasPage />} /> {/* 2. Añadir la ruta del dashboard */}
    </Routes>
  );
}

export default App;
