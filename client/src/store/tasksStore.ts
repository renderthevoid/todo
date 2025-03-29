import axiosClient from "@/api/axiosClient";
import { Task } from "@/types";
import { create } from "zustand";

interface TasksState {
  tasks: Task[] | Record<string, Task[]>;
  query: Record<string, string>; 
  isNeedRefresh: boolean;
  setQuery: (query: Record<string, string | number>) => void;
  setNeedRefresh: (value: boolean) => void;
  fetchTasks: () => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [] ,
  isNeedRefresh: false,
  query: {},

  setQuery: (query) => set({ query }),


  setNeedRefresh: (value) => {
    set({ isNeedRefresh: value });
    if (value) {
      get().fetchTasks();
    }
  },

  fetchTasks: async () => {
    try {
      const { query } = get();
      const { data } = await axiosClient.get("/api/tasks/", { params: query });
      set({ tasks: data, isNeedRefresh: false }); 
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      set({ isNeedRefresh: false }); 
    }
  },
}));