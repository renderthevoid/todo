import { AuthRequest } from "@/dto/authRequest.dto";
import { TaskWithUsers } from "@/dto/task.dto";
import checkSubordinates from "@/lib/utils/checkSubordinates";
import prisma from "@/prisma/prisma-client";
import { Role, Task } from "@prisma/client";
import { Response } from "express";

const passwordOmit = {
  omit: {
    password: true,
  },
};

export const TaskController = {
  getTasks: async (req: AuthRequest, res: Response): Promise<any> => {
    const { viewMode } = req.query;
    const userId = req.user?.userId;

    try {
      let tasks: TaskWithUsers[] = [];

      switch (viewMode) {
        case "byDueDate":
          tasks = await prisma.task.findMany({
            where: {
              assigneeId: userId,
            },
            include: {
              assignee: {
                ...passwordOmit,
              },
              creator: {
                ...passwordOmit,
              },
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
          const user = await prisma.user.findUnique({
            where: { id: userId },
          });
          if (user?.role !== Role.MANAGER) {
            return res.status(403).json({ error: "Access denied" });
          }

          tasks = await prisma.task.findMany({
            include: {
              assignee: {
                ...passwordOmit,
              },
              creator: {
                ...passwordOmit,
              },
            },
            orderBy: { updatedAt: "desc" },
          });

          const subordinateTasks = await Promise.all(
            tasks.map(async (task) => {
              if (!task.assignee) {
                return null;
              }
              const isSubordinate = await checkSubordinates(
                userId ?? "",
                task.assignee.id
              );
              return isSubordinate ? task : null;
            })
          ).then((tasks) => tasks.filter(Boolean));

          const groupedByAssignee = subordinateTasks.reduce(
            (acc: Record<string, typeof tasks>, task) => {
              const assigneeName = task?.assignee
                ? `${task.assignee.firstName} ${task.assignee.lastName}`
                : "Unassigned";

              if (!acc[assigneeName]) {
                acc[assigneeName] = [];
              }
              acc[assigneeName].push(task!);
              return acc;
            },
            {}
          );
          return res.json(groupedByAssignee);

        default:
          tasks = await prisma.task.findMany({
            include: {
              assignee: {
                ...passwordOmit,
              },
              creator: {
                ...passwordOmit,
                include: {
                  subordinates: true,
                },
              },
            },
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
    if (!req.user) {
      return res.status(401).json({ message: "Неавторизованный пользователь" });
    }
    try {
      const { title, description, dueDate, priority, assigneeId } = req.body;

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

  getTaskById: async (req: AuthRequest, res: Response): Promise<any> => {
    const taskId = req.params.id;
    const userId = req.user?.userId;

    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          assignee: {
            ...passwordOmit,
          },
          creator: {
            ...passwordOmit,
          },
        },
      });

      if (task && (task.creatorId !== userId || task.assigneeId !== userId)) {
        return res.status(403).json({ error: "Access denied" });
      }
    } catch (e) {
      console.error("Ошибка при получении задачи:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  updateTaskById: async (req: AuthRequest, res: Response): Promise<any> => {
    const taskId = req.params.id;
    const { title, description, dueDate, priority, status, assigneeId } =
      req.body;
    const { taskAccess } = req;

    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { id: true },
      });

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      let updateData: Partial<Task> = {};

      if (taskAccess?.allowOnlyStatus) {
        if (Object.keys(req.body).some((key) => key !== "status")) {
          return res.status(403).json({
            error: "You can only change the task status",
          });
        }
        updateData = { status: status };
      } else {
        updateData = {
          title: title,
          description: description,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          priority: priority,
          status: status,
          ...(assigneeId && { assigneeId: assigneeId }),
        };
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
        include: {
          creator: passwordOmit,
          assignee: passwordOmit,
        },
      });

      return res.status(200).json({ task: updatedTask });
    } catch (error) {
      console.error("Error updating task:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};
