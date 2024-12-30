import type { Expense } from './ExpenseForm';

type ExpenseChartProps = {
  expenses: Expense[];
};

export const ExpenseChart = ({ expenses }: ExpenseChartProps) => {
  const payerTotals = expenses.reduce((acc, expense) => {
    acc[expense.payer] = (acc[expense.payer] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <div className="space-y-3">
        {Object.entries(payerTotals).map(([payer, amount]) => (
          <div key={payer} className="flex justify-between items-center">
            <span className="text-sm font-medium">{payer} paid:</span>
            <span className="font-semibold">{formatAmount(amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};