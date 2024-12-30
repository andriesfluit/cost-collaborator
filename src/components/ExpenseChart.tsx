import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Expense } from './ExpenseForm';

type ExpenseChartProps = {
  expenses: Expense[];
};

const COLORS = ['#0EA5E9', '#22C55E', '#EAB308', '#EC4899', '#8B5CF6', '#64748B'];

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
    <div className="h-[300px] w-full bg-white rounded-lg shadow-sm p-4">
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
              value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              })
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};