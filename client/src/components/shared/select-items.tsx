import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
interface IItem {
  firstName: string;
  id: string;
  lastName: string;
  login: string;
  managerId: string | null;
  middleName: string;
  password: string;
  role: string;
}
interface Props {
  items: IItem[];
  title: string;
  placeholder: string;
  className?: string;
  onSelected: (value: string) => void;
}

export const SelectItems: React.FC<Props> = ({
  className,
  items,
  title,
  placeholder,
  onSelected,
}) => {
  return (
    <Select onValueChange={onSelected}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item?.lastName} {item?.firstName} {item?.middleName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
