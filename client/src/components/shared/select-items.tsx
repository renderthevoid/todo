import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JSX } from "react";

interface Props<T> {
  items: T[];
  title: string;
  placeholder: string;
  className?: string;
  disabled?: boolean;
  value?: string;
  onSelected: (value: string) => void;
  getKey?: (item: T) => string;
  getLabel?: (item: T) => string;
}

const defaultKeyExtractor = <T,>(item: T): string => {
  if (typeof item === "object" && item !== null && "id" in item) {
    return String(item.id);
  }
  return String(item);
};

const defaultLabelExtractor = <T,>(item: T): string => {
  if (typeof item === "object" && item !== null && "label" in item) {
    return String(item.label);
  }
  return String(item);
};

export const SelectItems = <T,>({
  className,
  items,
  title,
  placeholder,
  value,
  disabled = false,
  onSelected,
  getKey = defaultKeyExtractor,
  getLabel = defaultLabelExtractor,
}: Props<T>): JSX.Element => {
  return (
    <Select value={value} onValueChange={onSelected} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          {items.map((item) => (
            <SelectItem key={getKey(item)} value={getKey(item)}>
              {getLabel(item)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
