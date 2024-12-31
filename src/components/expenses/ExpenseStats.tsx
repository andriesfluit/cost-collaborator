import { Expense } from '@/components/expense-form/types';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useQueryClient } from '@tanstack/react-query';

interface BalanceStats {
  total: number;
  byPayer: {
    A: number;
    S: number;
  };
  balance: number;
  whoOwes: string;
}

interface ExpenseStatsProps {
  expenses: Expense[];
}

export const ExpenseStats = ({ expenses }: ExpenseStatsProps) => {
  const queryClient = useQueryClient();

  const calculateBalance = (): BalanceStats => {
    const totalByPayer = expenses.reduce(
      (acc, expense) => {
        if (expense.payer === 'A') {
          acc.A += expense.amount;
          acc.SOwes += expense.amount * Number(expense.split_ratio_s);
        } else {
          acc.S += expense.amount;
          acc.AOwes += expense.amount * Number(expense.split_ratio_a);
        }
        return acc;
      },
      { A: 0, S: 0, AOwes: 0, SOwes: 0 }
    );

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

  const handleSettleExpenses = async () => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .neq('id', ''); // Delete all expenses for the current user (RLS will handle filtering)

      if (error) throw error;

      toast.success("All expenses have been settled and cleared");
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    } catch (error) {
      console.error('Error settling expenses:', error);
      toast.error("Failed to settle expenses");
    }
  };

  const balance = calculateBalance();

  return (
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
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full mt-4"
          >
            Settle Expenses
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settle Expenses</DialogTitle>
            <DialogDescription>
              This will delete all expenses after settlement. The current balance shows that {balance.whoOwes} owes {balance.balance.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR'
              })}. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleSettleExpenses}>
                Confirm Settlement
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};