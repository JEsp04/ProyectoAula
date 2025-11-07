import './App.css';
import { Routes, Route } from 'react-router-dom';
import {LoginPage} from './pages/LoginPage.jsx';
import {RegisterPage} from './pages/RegisterPage.jsx';
import {HomePage} from './pages/home.jsx'; 

function App() {
  return (
    <div className="min-h screen bg-white">
      <HomePage />
      <main>
        <LoginPage />
        <RegisterPage />
      </main>
    </div>
  );
}

export default App;

