import { Task } from "@/types";
import { TaskArrayOrGrouped } from "../../types/task.types";

export const areAllKeysEmptyArrays = (data: TaskArrayOrGrouped): boolean => {
  if (!data || Array.isArray(data)) return false;

  return Object.values(data).every(
    (tasksArray) => Array.isArray(tasksArray) && tasksArray.length === 0
  );
};

export const isTaskGrouped = (
  tasks: TaskArrayOrGrouped
): tasks is Record<string, Task[]> => {
  return !Array.isArray(tasks);
};
