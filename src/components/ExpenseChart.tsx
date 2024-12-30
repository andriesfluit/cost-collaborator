import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Expense } from './ExpenseForm';

type ExpenseChartProps = {
  expenses: Expense[];
};

const COLORS = ['#9b87f5', '#7E69AB', '#D6BCFA', '#E5DEFF', '#D3E4FD', '#F2FCE2'];

export const ExpenseChart = ({ expenses }: ExpenseChartProps) => {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="h-[300px] w-full bg-white rounded-xl shadow-sm p-6">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => 
              value.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR'
              })
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};