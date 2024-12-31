import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseChart } from '@/components/ExpenseChart';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';
import { ExpenseStats } from '@/components/expenses/ExpenseStats';
import { useExpenses } from '@/hooks/useExpenses';

const Index = () => {
  const navigate = useNavigate();
  const { expenses, isLoading, addExpense } = useExpenses();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

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
            <ExpenseForm onAddExpense={addExpense} />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-[#403E43] mb-2">
              Expense Distribution
            </h2>
            <ExpenseChart expenses={expenses} />
            <ExpenseStats expenses={expenses} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-[#403E43]">
              Expense History
            </h2>
            <div className="text-lg font-semibold text-[#8E9196]">
              Total: {expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('de-DE', {
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