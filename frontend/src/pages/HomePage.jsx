import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <section className="grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Contenedor principal con sombra y bordes redondeados */}
        <div className="bg-white dark:bg-gray-800 max-w-6xl w-full rounded-2xl shadow-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center gap-8 transform hover:scale-[1.01] transition-all duration-500">
          {/* Columna Izquierda: Texto y Botón */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white mb-4 leading-tight">
              Toma el control de tus finanzas con
              <span className="text-[#4F46E5]"> SmartBudget</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              La herramienta sencilla y poderosa para administrar tus gastos,
              crear presupuestos y alcanzar tus metas de ahorro. ¡Empieza a
              organizar tu dinero de forma inteligente hoy mismo!
            </p>

            <Link to="/register" className="inline-block bg-[#4F46E5] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Regístrate Gratis
            </Link>
          </div>

          {/* Columna Derecha: Imagen */}
          <div className="md:w-1/2 flex items-center justify-center mt-8 md:mt-0">
            <div className="relative">
              <img
                src="https://withplum.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fplum-website-production%2Feu_es_home_plum_brain_desktop.png&w=1200&q=75"
                alt="SmartBudget App Mockup"
                className="z-10 relative max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
