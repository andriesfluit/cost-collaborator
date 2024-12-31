import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DateAmountInputsProps = {
  date: string;
  amount: string;
  onDateChange: (value: string) => void;
  onAmountChange: (value: string) => void;
};

export const DateAmountInputs = ({
  date,
  amount,
  onDateChange,
  onAmountChange,
}: DateAmountInputsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm font-medium text-gray-700">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
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
          onChange={(e) => onAmountChange(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};