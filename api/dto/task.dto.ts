import { Task, User } from "@prisma/client";

export type TaskWithUsers = Task & {
  assignee?: User | null;
  creator?: User;
};
