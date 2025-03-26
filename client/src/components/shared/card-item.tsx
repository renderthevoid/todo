import React from "react";

interface Props {
  className?: string;
  task: Task;
}
interface Task {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignee: string;
  status: "todo" | "in-progress" | "completed";
}

const priorityMap = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
  cancelled: "bg-gray-500",
};

const statusMap = {
  todo: "bg-gray-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-gray-500",
};
export const CardItem: React.FC<Props> = ({ task }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <div className="flex justify-between w-full items-center gap-1.5 flex-wrap">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <span
          className={`text-white text-xs font-bold px-2 py-1 rounded-full ${
            priorityMap[task.priority]
          }`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      <div className="mt-2">
        <span className="text-sm font-medium text-gray-600">
          Дата окончания:
        </span>
        <span className="ml-2 text-gray-700">
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-2">
        <span className="text-sm font-medium text-gray-600">
          Ответственный:
        </span>
        <span className="ml-2 text-gray-700">{task.assignee}</span>
      </div>

      <div className="flex items-center mt-2">
        <span className="text-sm font-medium text-gray-600 mr-2">Статус:</span>
        <span
          className={`text-white text-xs font-bold px-2 py-1 rounded-full ${
            statusMap[task.status]
          }`}
        >
          {task.status === "todo"
            ? "В ожидании"
            : task.status === "in-progress"
            ? "В процессе"
            : "Завершено"}
        </span>
      </div>
    </div>
  );
};
