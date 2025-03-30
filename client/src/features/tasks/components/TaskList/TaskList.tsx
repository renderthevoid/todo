import React from "react";

import { CardItem } from "@/components/shared";
import { TaskGroup } from "../TaskGroup";
import { useTaskList } from "./useTaskList";
import { areAllKeysEmptyArrays, isTaskGrouped } from "./TaskList.utils";

interface TaskListProps {
  className?: string;
}

export const TaskList: React.FC<TaskListProps> = ({ className }) => {
  const { tasks, statusHelpers } = useTaskList();

  if (areAllKeysEmptyArrays(tasks)) {
    return (
      <div className="text-center text-gray-600">
        <p>Задач не обнаружено 🙂</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {isTaskGrouped(tasks) ? (
        Object.entries(tasks).map(([assigneeName, assigneeTasks]) => (
          <TaskGroup
            key={assigneeName}
            assigneeName={assigneeName}
            tasks={assigneeTasks}
            statusHelpers={statusHelpers}
          />
        ))
      ) : (
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
      )}
    </div>
  );
};
