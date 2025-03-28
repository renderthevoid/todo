export interface User {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  login: string;
  role: "USER" | "MANAGER";
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date | string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELED";
  creatorId: string;
  creator?: User;
  assigneeId?: string;
  assignee?: User;
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELED = 'CANCELED',
}