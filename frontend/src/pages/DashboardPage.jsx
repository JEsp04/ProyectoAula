import { useEffect } from "react";
import { useExpenseStore } from "../store/useExpenseStore";
import ExpenseCard from "../components/ExpenseCard";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const { expenses, fetchExpenses } = useExpenseStore();

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
        {expenses.map((exp) => (
          <ExpenseCard
            key={exp.id}
            title={exp.titulo}
            amount={exp.monto}
            category={exp.categoria}
          />
        ))}
      </div>
    </div>
  );
}
