import axiosClient from "@/api/axiosClient";
import { CardItem, Container } from "@/components/shared";
import React from "react";

interface Props {
  className?: string;
}

export const Index: React.FC<Props> = ({ className }) => {
  const [tasks, setTasks] = React.useState([]);


  const fetchTasks = async () => {
    const response = await axiosClient.get("/api/tasks");
    const data = await response.data;
    console.log(data)
    setTasks(data);
  };

  React.useEffect(() => {
    fetchTasks();
  }, []);

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
