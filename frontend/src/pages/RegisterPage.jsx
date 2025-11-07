import Navbar from "../components/Navbar";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
