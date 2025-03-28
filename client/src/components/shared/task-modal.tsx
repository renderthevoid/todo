import { useForm } from "@/hooks/useForm";

import { useModalStore } from "@/store/modalStore";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  className?: string;
}

const initialTask = {
  id: "",
  title: "",
  description: "",
  dueDate: new Date().toISOString(),
  priority: "LOW",
  status: "TODO",
  creatorId: "",
  assigneeId: "",
};

const taskSchema = z.object({
  title: z.string().min(3, "Название должно содержать минимум 3 символа"),
  description: z.string().optional(),
  dueDate: z
    .string()
    .refine(
      (value) => !isNaN(Date.parse(value)),
      "Дата должна быть корректной"
    ),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    errorMap: () => ({ message: "Выберите приоритет" }),
  }),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"], {
    errorMap: () => ({ message: "Выберите статус" }),
  }),
});

export const TaskModal: React.FC<Props> = ({ className }) => {
  const { isOpen, taskToEdit, closeModal } = useModalStore();
  const [showErrors, setShowErrors] = useState(false);

  const { formData, updateInput, updateSelect, validateAndSubmit } = useForm(
    taskToEdit || initialTask,
    taskSchema
  );

  const taskData = {
    ...initialTask,
    ...formData,
  };
  const errors = showErrors ? validateAndSubmit(taskData) : undefined;
  const handleSave = async () => {
    try {
      const isErrors = validateAndSubmit(taskData);

      if (isErrors) {
        setShowErrors(true);
        return;
      }

      if (taskToEdit) {
        console.log("Редактирование задачи:", taskData);
        // await axiosClient.put(`/api/tasks/${taskToEdit.id}`, validatedData);
      } else {
        console.log("Создание новой задачи:", taskData);
        // await axiosClient.post("/api/tasks", validatedData);
      }
      closeModal();
    } catch (error) {
      console.error("Ошибка при сохранении задачи:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {taskToEdit ? "Редактировать задачу" : "Добавить задачу"}
          </DialogTitle>
          <DialogDescription>
            {taskToEdit
              ? 'Измените данные задачи и нажмите "Сохранить".'
              : 'Введите данные для новой задачи и нажмите "Сохранить".'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-left block">
              Название
            </Label>
            <div className="col-span-3">
              <Input
                id="title"
                name="title"
                value={taskData.title || ""}
                onChange={updateInput}
                className="w-full"
              />{" "}
              <span className="text-red-500 text-sm">
                {errors?.title?._errors.join(", ")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Описание
            </Label>
            <Input
              id="description"
              name="description"
              value={taskData.description || ""}
              onChange={updateInput}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-left">
              Срок выполнения
            </Label>
            <Input
              type="date"
              id="dueDate"
              name="dueDate"
              value={
                new Date(taskData.dueDate || "").toISOString().split("T")[0]
              }
              onChange={updateInput}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Приоритет
            </Label>
            <Select
              value={taskData.priority || "LOW"}
              onValueChange={(value) => updateSelect("priority", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Выберите приоритет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Низкий</SelectItem>
                <SelectItem value="MEDIUM">Средний</SelectItem>
                <SelectItem value="HIGH">Высокий</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Статус
            </Label>
            <Select
              value={taskData.status || "TODO"}
              onValueChange={(value) => updateSelect("status", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">В ожидании</SelectItem>
                <SelectItem value="IN_PROGRESS">В процессе</SelectItem>
                <SelectItem value="DONE">Завершено</SelectItem>
                <SelectItem value="CANCELED">Отменено</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
