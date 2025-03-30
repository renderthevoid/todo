import { Task } from '@/types';
import { axiosClient } from "@/api/axios";



type CreateTaskData = Omit<Task, "id" | "creatorId">;
type UpdateTaskData = Partial<CreateTaskData>;

export const TaskService = {
  async getAll(): Promise<Task[]> {
    const response = await axiosClient.get<{ tasks: Task[] }>("/api/tasks");
    return response.data.tasks;
  },

  async getById(id: string): Promise<Task> {
    const response = await axiosClient.get<Task>(`/api/tasks/${id}`);
    return response.data;
  },

  async create(taskData: CreateTaskData): Promise<Task> {
    const response = await axiosClient.post<Task>("/api/createTask", taskData);
    return response.data;
  },

  async update(id: string, taskData: UpdateTaskData): Promise<Task> {
    const response = await axiosClient.put<Task>(`/api/tasks/${id}`, taskData);
    return response.data;
  },

};