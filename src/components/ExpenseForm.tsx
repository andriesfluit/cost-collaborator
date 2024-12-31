import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DateAmountInputs } from "./expense-form/DateAmountInputs";
import { DescriptionInput } from "./expense-form/DescriptionInput";
import { PayerSplitInputs } from "./expense-form/PayerSplitInputs";
import { Expense, Payer, SplitType } from "./expense-form/types";

type ExpenseFormProps = {
  onAddExpense: (expense: Expense) => void;
};

export const ExpenseForm = ({ onAddExpense }: ExpenseFormProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [payer, setPayer] = useState<Payer | ''>('');
  const [split_type, setSplitType] = useState<SplitType | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !payer || !split_type) {
      toast.error("Please fill in all fields");
      return;
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      date,
      amount: parseFloat(amount),
      description,
      payer,
      split_type
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
      <DateAmountInputs
        date={date}
        amount={amount}
        onDateChange={setDate}
        onAmountChange={setAmount}
      />
      <DescriptionInput
        description={description}
        onDescriptionChange={setDescription}
      />
      <PayerSplitInputs
        payer={payer}
        splitType={split_type}
        onPayerChange={setPayer}
        onSplitTypeChange={setSplitType}
      />
      <Button type="submit" className="w-full bg-[#D3E4FD] hover:bg-[#8E9196] text-[#403E43] hover:text-white">
        Add Expense
      </Button>
    </form>
  );
};