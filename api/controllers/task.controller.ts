import { AuthRequest } from "@/dto/authRequest.dto";
import prisma from "@/prisma/prisma-client";
import { Task } from "@prisma/client";
import { Response } from "express";

export const TaskController = {
  getTasks: async (req: AuthRequest, res: Response): Promise<any> => {
    const { viewMode } = req.query;
    const userId = req.user?.userId;

    try {
      let tasks: Task[] = [];

      switch (viewMode) {
        case "byDueDate":
          tasks = await prisma.task.findMany({
            where: {
              OR: [{ creatorId: userId }, { assigneeId: userId }],
            },
            include: {
              assignee: true,
            },
            orderBy: { updatedAt: "desc" },
          });

          const now = new Date();
          const oneWeekLater = new Date();
          oneWeekLater.setDate(now.getDate() + 7);

          const groupedByDueDate = {
            today: tasks.filter(
              (task) => task.dueDate.toDateString() === now.toDateString()
            ),
            thisWeek: tasks.filter(
              (task) => task.dueDate > now && task.dueDate <= oneWeekLater
            ),
            future: tasks.filter((task) => task.dueDate > oneWeekLater),
          };
          return res.json(groupedByDueDate);

        case "byAssignee":
          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user?.role !== "MANAGER") {
            return res.status(403).json({ error: "Access denied" });
          }

          tasks = await prisma.task.findMany({
            include: { assignee: true },
            orderBy: { updatedAt: "desc" },
          });

          const groupedByAssignee = tasks.reduce<Record<string, typeof tasks>>(
            (acc, task) => {
              const assigneeName = task.assignee
                ? `${task.assignee.firstName} ${task.assignee.lastName}`
                : "Unassigned";
              if (!acc[assigneeName]) acc[assigneeName] = [];
              acc[assigneeName].push(task);
              return acc;
            },
            {}
          );
          return res.json(groupedByAssignee);

        default:
          tasks = await prisma.task.findMany({
            include: { assignee: true, creator: true },
            orderBy: { updatedAt: "desc" },
          });
          return res.json(tasks);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createTask: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { title, description, dueDate, priority, assigneeId } = req.body;

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Неавторизованный пользователь" });
      }

      const task = await prisma.task.create({
        data: {
          title,
          description,
          dueDate: new Date(dueDate),
          priority,
          status: "TODO",
          creatorId: req.user.userId,
          assigneeId,
        },
      });

      res.status(201).json(task);
    } catch (error) {
      console.error("Ошибка при создании задачи:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  },
};
