import { CardItem } from "@/components/shared";
import { Task } from "@/types";
import React from "react";
import { TaskStatusHelpers } from "../../types/task.types";

interface TaskGroupProps {
  assigneeName: string;
  tasks: Task[];
  statusHelpers: TaskStatusHelpers;
}

export const TaskGroup: React.FC<TaskGroupProps> = ({
  assigneeName,
  tasks,
  statusHelpers,
}) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-semibold text-gray-800">{assigneeName}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <CardItem
          key={task.id}
          task={task}
          isEnded={statusHelpers.isTaskEnded(task)}
          isExpired={statusHelpers.isTaskExpired(task)}
        />
      ))}
    </div>
  </div>
);
