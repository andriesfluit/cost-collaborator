import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Payer, SplitType } from "./types";

type PayerSplitInputsProps = {
  payer: Payer | '';
  splitType: SplitType | '';
  onPayerChange: (value: Payer) => void;
  onSplitTypeChange: (value: SplitType) => void;
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

export const PayerSplitInputs = ({
  payer,
  splitType,
  onPayerChange,
  onSplitTypeChange,
}: PayerSplitInputsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="payer" className="text-sm font-medium text-gray-700">Paid by</Label>
        <Select value={payer} onValueChange={onPayerChange}>
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
        <Select value={splitType} onValueChange={onSplitTypeChange}>
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
  );
};