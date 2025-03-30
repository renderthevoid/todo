import { Container, FiltersPanel, TaskModal } from "@/components/shared";
import React from "react";

import { TaskList } from "@/features/tasks/components/TaskList";

export const IndexPage: React.FC = () => {
  return (
    <main className="my-9">
      <TaskModal />
      <Container>
        <div className="flex flex-col gap-5 w-full">
          <FiltersPanel />
          <TaskList />
        </div>
      </Container>
    </main>
  );
};
