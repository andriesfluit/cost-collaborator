import { useState, useEffect } from 'react';
import { ExpenseForm, type Expense } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseChart } from '@/components/ExpenseChart';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Expense[];
    }
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (expense: Omit<Expense, 'id' | 'created_at' | 'user_id' | 'split_ratio_a' | 'split_ratio_s'>) => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          ...expense,
          user_id: user.data.user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Expense added successfully");
    },
    onError: (error) => {
      console.error('Error adding expense:', error);
      toast.error("Failed to add expense");
    }
  });

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    addExpenseMutation.mutate(expense);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Calculate balances
  const calculateBalance = () => {
    const totalByPayer = expenses.reduce(
      (acc, expense) => {
        if (expense.payer === 'A') {
          acc.A += expense.amount;
          // Add what S owes based on their split ratio
          acc.SOwes += expense.amount * Number(expense.split_ratio_s);
        } else {
          acc.S += expense.amount;
          // Add what A owes based on their split ratio
          acc.AOwes += expense.amount * Number(expense.split_ratio_a);
        }
        return acc;
      },
      { A: 0, S: 0, AOwes: 0, SOwes: 0 }
    );

    // Calculate final balance
    const finalBalance = (totalByPayer.A - totalByPayer.AOwes) - (totalByPayer.S - totalByPayer.SOwes);
    
    return {
      total: totalByPayer.A + totalByPayer.S,
      byPayer: {
        A: totalByPayer.A,
        S: totalByPayer.S
      },
      balance: Math.abs(finalBalance),
      whoOwes: finalBalance > 0 ? 'S' : 'A'
    };
  };

  const balance = calculateBalance();

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
            <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Expenses:</span>
                <span className="font-semibold">
                  {balance.total.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">A paid:</span>
                <span>
                  {balance.byPayer.A.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">S paid:</span>
                <span>
                  {balance.byPayer.S.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center font-semibold">
                  <span>Balance:</span>
                  <span className="text-[#403E43]">
                    {balance.whoOwes} owes {balance.balance.toLocaleString('de-DE', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-[#403E43]">
              Expense History
            </h2>
            <div className="text-lg font-semibold text-[#8E9196]">
              Total: {balance.total.toLocaleString('de-DE', {
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