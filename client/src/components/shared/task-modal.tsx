import axiosClient from "@/api/axiosClient";
import useAuthStore from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { useTasksStore } from "@/store/tasksStore";
import { Priority, Status, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { SelectItems } from "./select-items";

interface Props {
  className?: string;
}
const initialData: TaskSchema = {
  title: "",
  description: "",
  dueDate: new Date().toISOString().split("T")[0],
  priority: "LOW",
  status: "TODO",
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
  assigneeId: z.string().optional(),
});

type TaskSchema = z.infer<typeof taskSchema>;

export const TaskModal: React.FC<Props> = ({ className }) => {
  const { isOpen, taskToEdit, closeModal } = useModalStore();
  const { setNeedRefresh } = useTasksStore();
  const { userId } = useAuthStore();
  const [users, setUsers] = useState([]);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: { ...initialData },
  });

  const isDisabled = (): boolean => {
    const statusValue = watch("status");

    return (
      (userId !== taskToEdit?.creatorId && !!taskToEdit) ||
      statusValue ===
        Object.keys(Status)
          .filter((i) => i === "CANCELED")
          .join("")
    );
  };

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        const formattedDueDate = new Date(taskToEdit.dueDate)
          .toISOString()
          .split("T")[0];
        reset({
          ...taskToEdit,
          dueDate: formattedDueDate,
        });
      } else {
        reset({ ...initialData });
      }
    }
  }, [isOpen, reset, taskToEdit]);

  const fetchAllUsers = async () => {
    try {
      const res = await axiosClient.get("/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const onSubmit = async (data: TaskSchema) => {
    try {
      if (taskToEdit) {
        console.log("Редактирование задачи:", data);
        await axiosClient.put(`/api/tasks/${taskToEdit.id}`, data);
      } else {
        console.log("Создание новой задачи:", data);
        await axiosClient.post("/api/createTask", data);
      }
      setNeedRefresh(true);
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
        <form
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 py-4"
        >
          <div className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-left block">
                Название
              </Label>
              <div className="col-span-3">
                <Input
                  id="title"
                  {...register("title")}
                  className="w-full"
                  disabled={isDisabled()}
                />{" "}
                {errors.title && (
                  <span className="text-red-500 text-sm">
                    {errors.title.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Описание
              </Label>
              <Input
                id="description"
                {...register("description")}
                className="col-span-3"
                disabled={isDisabled()}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-left">
                Срок выполнения
              </Label>
              <Input
                type="date"
                id="dueDate"
                value={watch("dueDate")}
                {...register("dueDate")}
                className="col-span-3"
                disabled={isDisabled()}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Приоритет
              </Label>
              <SelectItems
                className="w-full col-span-3"
                items={Object.entries(Priority).map(([key, value]) => ({
                  id: key,
                  label: value,
                }))}
                title="Приоритет"
                placeholder="Укажите приоритет"
                value={watch("priority")}
                onSelected={(value) =>
                  setValue("priority", value as keyof typeof Priority)
                }
                disabled={isDisabled()}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Статус
              </Label>
              <SelectItems
                className="w-full col-span-3"
                items={Object.entries(Status).map(([key, value]) => ({
                  id: key,
                  label: value,
                }))}
                title="Статус"
                placeholder="Укажите статус"
                value={watch("status")}
                onSelected={(value) =>
                  setValue("status", value as keyof typeof Status)
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignee">Ответственный</Label>
              <SelectItems
                className="w-full col-span-3"
                items={users as User[]}
                title="Ответственный"
                placeholder="Выберите руководителя"
                value={watch("assigneeId")}
                onSelected={(value) => setValue("assigneeId", value)}
                disabled={isDisabled()}
                getLabel={(user) =>
                  `${user.lastName ?? ""} ${user.firstName ?? ""} ${
                    user.middleName ?? ""
                  }`
                }
              ></SelectItems>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
