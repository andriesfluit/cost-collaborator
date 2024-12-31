import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Expense } from '@/components/expense-form/types';

export const useExpenses = () => {
  const queryClient = useQueryClient();

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
      if (!user.data.user) throw new Error('No user found');

      const newExpense = {
        ...expense,
        user_id: user.data.user.id,
        split_ratio_a: expense.split_type === 'restaurant' ? 0.6 : 
                      expense.split_type === 'no-kids' ? 0.5 : 0.75,
        split_ratio_s: expense.split_type === 'restaurant' ? 0.4 : 
                      expense.split_type === 'no-kids' ? 0.5 : 0.25,
      };
      
      const { data, error } = await supabase
        .from('expenses')
        .insert([newExpense])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      console.error('Error adding expense:', error);
      toast.error("Failed to add expense");
    }
  });

  return {
    expenses,
    isLoading,
    addExpense: addExpenseMutation.mutate
  };
};