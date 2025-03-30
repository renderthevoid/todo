import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { useTasksStore } from "@/store/tasksStore";
import { Calendar1, RotateCcw, UserRoundSearch } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface Props {
  className?: string;
}

export const FiltersPanel: React.FC<Props> = ({ className }) => {
  const [groupValue, setGroupValue] = React.useState<string>("");
  const { setNeedRefresh, setQuery } = useTasksStore();
  const { userRole } = useAuthStore();

  const updateValue = (value: string | null) => {
    if (value) {
      setQuery({ viewMode: value });
      setNeedRefresh(true);
      setGroupValue(value);
    }
  };

  const resetValue = () => {
    setGroupValue("");
    setQuery({ viewMode: "" });
    setNeedRefresh(true);
  };

  return (
    <div className={cn("flex gap-2 items-center justify-end", className)}>
      {!!groupValue.length && (
        <Button variant="ghost" onClick={resetValue} size="icon">
          <RotateCcw />
        </Button>
      )}
      <ToggleGroup
        type="single"
        value={groupValue}
        onValueChange={(value) => updateValue(value)}
      >
        <ToggleGroupItem
          value="byAssignee"
          aria-label="Toggle byAssignee"
          className={`h-10 w-10 cursor-pointer ${
            userRole === "USER" ? "hidden" : ""
          }`}
        >
          <UserRoundSearch />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="byDueDate"
          aria-label="Toggle byDueDate"
          className="h-10 w-10 cursor-pointer"
        >
          <Calendar1 />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
