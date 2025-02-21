import { cn } from "@/lib/utils";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type Props = {
  label: string;
  value?: string;
  onValueChange: (e: string) => void;
  placeholder?: string;
  items: { value: string; label: string }[];
  containerClassName?: string;
  disabled?: boolean;
};

const SelectWithLabel = ({
  items,
  label,
  onValueChange,
  value,
  placeholder,
  containerClassName,
  disabled = false,
}: Props) => {
  return (
    <div className={cn("w-fit space-y-1", containerClassName)}>
      <Label className="text-zinc-500 text-xs">{label}</Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-56 overflow-y-auto">
          {items.map((item, i) => (
            <SelectItem key={i} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectWithLabel;
