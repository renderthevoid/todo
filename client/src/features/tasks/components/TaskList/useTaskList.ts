import { useTasksStore } from "@/store/tasksStore";
import { Task } from "@/types";
import { useEffect } from "react";

export const useTaskList = () => {
  const { tasks, fetchTasks } = useTasksStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const isTaskEnded = (task: Task) => task.status === "DONE";

  const isTaskExpired = (task: Task) =>
    !isTaskEnded(task) && new Date(task.dueDate) < new Date();

  return {
    tasks,
    statusHelpers: { isTaskEnded, isTaskExpired },
  };
};
