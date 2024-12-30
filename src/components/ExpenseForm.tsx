import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export type Expense = {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
};

type ExpenseFormProps = {
  onAddExpense: (expense: Expense) => void;
};

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Shopping",
  "Other"
];

export const ExpenseForm = ({ onAddExpense }: ExpenseFormProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      date,
      amount: parseFloat(amount),
      description,
      category
    };

    onAddExpense(expense);
    setAmount('');
    setDescription('');
    setCategory('');
    toast.success("Expense added successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium text-gray-700">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount (€)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
        <Input
          id="description"
          placeholder="Enter expense description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
        Add Expense
      </Button>
    </form>
  );
};