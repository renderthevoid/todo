import { CardItem, Container, FiltersPanel } from "@/components/shared";
import { useTasksStore } from "@/store/tasksStore";
import { Task } from "@/types";
import React, { useEffect } from "react";

interface Props {
  className?: string;
}

export const Index: React.FC<Props> = ({ className }) => {
  const { tasks, query, fetchTasks, isNeedRefresh } = useTasksStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  const isTaskEnded = (task: Task) => task.status === "DONE";

  const isTaskExpired = (task: Task) =>
    !isTaskEnded(task) && new Date(task.dueDate) < new Date();

  return (
    <main className="my-9">
      <Container>
        <div className="flex flex-col gap-5 w-full">
          <FiltersPanel />

          {!Array.isArray(tasks) ? (
            <div className="flex flex-col gap-8 w-full">
              {Object.entries(tasks as Record<string, Task[]>).map(
                ([assigneeName, assigneeTasks]) => (
                  <div key={assigneeName} className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {assigneeName}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {assigneeTasks.map((task) => (
                        <CardItem
                          key={task.id}
                          task={task}
                          isEnded={isTaskEnded(task)}
                          isExpired={isTaskExpired(task)}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Array.isArray(tasks) ? tasks : []).map((task) => (
                <CardItem
                  key={task.id}
                  task={task}
                  isEnded={isTaskEnded(task)}
                  isExpired={isTaskExpired(task)}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
};
