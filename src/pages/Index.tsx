import { useState } from 'react';
import { ExpenseForm, type Expense } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseChart } from '@/components/ExpenseChart';

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Expense Tracker
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Add New Expense
            </h2>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Expense Distribution
            </h2>
            <ExpenseChart expenses={expenses} />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Expense History
            </h2>
            <div className="text-lg font-semibold text-primary">
              Total: {totalExpenses.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
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