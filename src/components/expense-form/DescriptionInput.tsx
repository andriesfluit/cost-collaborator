import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DescriptionInputProps = {
  description: string;
  onDescriptionChange: (value: string) => void;
};

export const DescriptionInput = ({
  description,
  onDescriptionChange,
}: DescriptionInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
      <Input
        id="description"
        placeholder="Enter expense description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
};