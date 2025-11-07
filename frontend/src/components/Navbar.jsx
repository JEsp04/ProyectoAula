import { useState } from "react";
import { Link } from "react-router-dom";

// Icono para el logo
const WalletIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);





const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo y Nombre de la App */}
          <Link to="/" className="flex items-center gap-2 py-4">
            <div className="text-[#4F46E5]">
              <WalletIcon />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">
              Smart<span className="text-[#4F46E5]">Budget</span>
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-gray-600 dark:text-gray-300 font-medium hover:text-[#4F46E5] dark:hover:text-blue-400 px-3 py-2 rounded-md transition-colors duration-300">
              Inicio
            </Link>
            <Link to="/login" className="text-gray-600 dark:text-gray-300 font-medium hover:text-[#4F46E5] dark:hover:text-blue-400 px-3 py-2 rounded-md transition-colors duration-300">
              Login
            </Link>
            <Link to="/register" className="bg-[#4F46E5] text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-md">
              Registro
            </Link>
            <button
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              aria-label="Toggle Dark Mode"
            >
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="p-2 mr-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              aria-label="Toggle Dark Mode"
            >
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-gray-300 hover:text-[#4F46E5] focus:outline-none" aria-label="Toggle Menu">
              {isOpen ? (
                // Icono de X (cerrar)
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                // Icono de hamburguesa
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (desplegable) */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200 dark:border-gray-700`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#4F46E5] block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Inicio</Link>
          <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#4F46E5] block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Login</Link>
        </div>
        <div className="px-5 pb-4">
          <Link to="/register" className="bg-[#4F46E5] text-white font-bold w-full block text-center py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-md" onClick={() => setIsOpen(false)}>
            Registro
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
