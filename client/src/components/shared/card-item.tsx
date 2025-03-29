import useAuthStore from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { Task } from "@/types";
import { Pencil } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface Props {
  className?: string;
  task: Task;
  isEnded?: boolean;
  isExpired?: boolean;
}

const priorityColorMap = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
  canceled: "bg-gray-300",
};

const statusColorMap = {
  todo: "bg-gray-500",
  in_progress: "bg-blue-500",
  done: "bg-green-500",
  canceled: "bg-gray-300",
};

const statusMap = {
  todo: "В ожидании",
  in_progress: "В процессе",
  done: "Завершено",
  canceled: "Отменено",
};

const priorityMap = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
  cancelled: "Отменено",
};
export const CardItem: React.FC<Props> = ({ task, isExpired, isEnded }) => {
  const { userId } = useAuthStore();
  const { openModal } = useModalStore();
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between w-full items-center gap-1.5 flex-wrap">
          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
          <span
            className={`text-white text-xs font-bold px-2 py-1 rounded-full ${
              priorityColorMap[
                task.priority.toLocaleLowerCase() as keyof typeof priorityColorMap
              ]
            }`}
          >
            {
              priorityMap[
                task.priority.toLocaleLowerCase() as keyof typeof priorityMap
              ]
            }
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
            Создатель:
          </span>
          <span className="ml-2 text-gray-700">
            {task.creator?.lastName} {task.creator?.firstName}{" "}
            {task.creator?.middleName}
          </span>
        </div>

        <div className="mt-2">
          <span className="text-sm font-medium text-gray-600">
            Ответственный:
          </span>
          <span className="ml-2 text-gray-700">
            {task.assignee?.lastName} {task.assignee?.firstName}{" "}
            {task.assignee?.middleName}
          </span>
        </div>


        <div className="flex items-start justify-between mt-2">
          <div>
            <span className="text-sm font-medium text-gray-600 mr-2">
              Статус:
            </span>
            <span
              className={`text-white text-xs font-bold px-2 py-1 rounded-full ${
                statusColorMap[
                  task.status.toLocaleLowerCase() as keyof typeof statusColorMap
                ]
              }`}
            >
              {
                statusMap[
                  task.status.toLocaleLowerCase() as keyof typeof statusMap
                ]
              }
            </span>
          </div>
          <div className="flex justify-end">
            {(userId === task.assignee?.id || userId === task.creatorId) && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => openModal(task)}
              >
                <Pencil />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-0 right-0 w-full h-10 rounded-full opacity-20 blur-xl transform translate-x-1 translate-y-0.5 ${
          isEnded ? "bg-chart-2" : isExpired ? "bg-destructive" : "hidden"
        }`}
      ></div>
    </div>
  );
};
