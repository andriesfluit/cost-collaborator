import { Expense } from '@/components/expense-form/types';

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
    </div>
  );
};