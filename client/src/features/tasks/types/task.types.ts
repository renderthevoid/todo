import { Task } from "@/types";

export type GroupedTasks = Record<string, Task[]>;
export type TaskArrayOrGrouped = Task[] | GroupedTasks;

export interface TaskStatusHelpers {
  isTaskEnded: (task: Task) => boolean;
  isTaskExpired: (task: Task) => boolean;
}



