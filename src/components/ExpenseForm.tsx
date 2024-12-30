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

export type SplitType = 'restaurant' | 'no-kids' | 'kids';
export type Payer = 'A' | 'S';

export type Expense = {
  id: string;
  date: string;
  amount: number;
  description: string;
  payer: Payer;
  splitType: SplitType;
};

type ExpenseFormProps = {
  onAddExpense: (expense: Expense) => void;
};

const splitTypes = [
  { value: 'restaurant', label: 'Restaurant (50/50)' },
  { value: 'no-kids', label: 'No Kids (60/40)' },
  { value: 'kids', label: 'Kids (35/65)' }
] as const;

const payers = [
  { value: 'A', label: 'A' },
  { value: 'S', label: 'S' }
] as const;

export const ExpenseForm = ({ onAddExpense }: ExpenseFormProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [payer, setPayer] = useState<Payer | ''>('');
  const [splitType, setSplitType] = useState<SplitType | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !payer || !splitType) {
      toast.error("Please fill in all fields");
      return;
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      date,
      amount: parseFloat(amount),
      description,
      payer,
      splitType
    };

    onAddExpense(expense);
    setAmount('');
    setDescription('');
    setPayer('');
    setSplitType('');
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="payer" className="text-sm font-medium text-gray-700">Paid by</Label>
          <Select value={payer} onValueChange={(value: Payer) => setPayer(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payer" />
            </SelectTrigger>
            <SelectContent>
              {payers.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="splitType" className="text-sm font-medium text-gray-700">Split Type</Label>
          <Select value={splitType} onValueChange={(value: SplitType) => setSplitType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select split type" />
            </SelectTrigger>
            <SelectContent>
              {splitTypes.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full bg-[#D3E4FD] hover:bg-[#8E9196] text-[#403E43] hover:text-white">
        Add Expense
      </Button>
    </form>
  );
};