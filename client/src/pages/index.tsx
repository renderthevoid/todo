import { CardItem, Container } from "@/components/shared";
import React from "react";

interface Props {
  className?: string;
}

export const Index: React.FC<Props> = ({ className }) => {
  const tasks = [
    {
      id: "1",
      title: "Разработать новый дизайн главной страницы",
      priority: "high",
      dueDate: "2023-11-15",
      assignee: "Анна К.",
      status: "in-progress",
    },
    {
      id: "2",
      title: "Написать документацию по API",
      priority: "medium",
      dueDate: "2023-11-20",
      assignee: "Иван П.",
      status: "todo",
    },
    {
      id: "3",
      title: "Провести ревью кода",
      priority: "low",
      dueDate: "2023-11-10",
      assignee: "Мария С.",
      status: "completed",
    },
		{
      id: "1",
      title: "Разработать новый дизайн главной страницы",
      priority: "high",
      dueDate: "2023-11-15",
      assignee: "Анна К.",
      status: "in-progress",
    },
    {
      id: "2",
      title: "Написать документацию по API",
      priority: "medium",
      dueDate: "2023-11-20",
      assignee: "Иван П.",
      status: "todo",
    },
    {
      id: "3",
      title: "Провести ревью кода",
      priority: "low",
      dueDate: "2023-11-10",
      assignee: "Мария С.",
      status: "completed",
    },
  ];
  return (
    <main className="my-9">
      <Container>
        <div className="grid grid-cols-3 gap-4 w-full">
          {tasks.map((task) => (
            <CardItem key={task.id} task={task} />
          ))}
        </div>
      </Container>
    </main>
  );
};
