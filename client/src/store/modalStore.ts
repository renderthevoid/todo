import { Task } from "@/types";
import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  taskToEdit: Task | null;
  openModal: (task?: Task) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  taskToEdit: null,
  openModal: (task) => set({ isOpen: true, taskToEdit: task || null }),
  closeModal: () => set({ isOpen: false, taskToEdit: null }),
}));
