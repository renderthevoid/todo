import prisma from "@/prisma/prisma-client";
import checkSupervisor from './checkSupervisor';

export async function checkTaskAccess(
  userId: string,
  taskId: string
): Promise<TaskAccess> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { creator: true },
  });

  if (!task) throw new Error("Task not found");

  if (task.creatorId === userId) {
    return { canEdit: true };
  }

  const isSupervisor = await checkSupervisor(userId, task.creatorId);
  if (isSupervisor) {
    return { canEdit: true, allowOnlyStatus: true };
  }

  return { canEdit: false };
}
