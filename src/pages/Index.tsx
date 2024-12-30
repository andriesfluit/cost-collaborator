import { useState, useEffect } from 'react';
import { ExpenseForm, type Expense } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseChart } from '@/components/ExpenseChart';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-[#FAFBFD] py-4 px-4 md:py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#403E43]">
            Expense Tracker
          </h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="text-[#403E43]"
          >
            Logout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-[#403E43] mb-2">
              Add New Expense
            </h2>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-[#403E43] mb-2">
              Expense Distribution
            </h2>
            <ExpenseChart expenses={expenses} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-[#403E43]">
              Expense History
            </h2>
            <div className="text-lg font-semibold text-[#8E9196]">
              Total: {totalExpenses.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR'
              })}
            </div>
          </div>
          <ExpenseList expenses={expenses} />
        </div>
      </div>
    </div>
  );
};

export default Index;