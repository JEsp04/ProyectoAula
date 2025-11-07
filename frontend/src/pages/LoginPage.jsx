import Navbar from "../components/Navbar";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
