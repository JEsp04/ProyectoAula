import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="relative min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1911&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">Bienvenido</h1>
            <p className="text-gray-300">Inicia sesión para continuar</p>
          </header>
          <main className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg">
            <LoginForm />
          </main>
          <footer className="text-center mt-4">
            <p className="text-gray-300">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-indigo-300 hover:text-indigo-200">
                Regístrate
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
