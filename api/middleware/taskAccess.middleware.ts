import { checkTaskAccess } from "@/lib/utils/checkTaskAccess";
import { NextFunction, Request, Response } from "express";
declare global {
  interface TaskAccess {
    canEdit: boolean;
    allowOnlyStatus?: boolean;
  }
}

export const taskAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const taskId = req.params.id || req.body.taskId;
  const currentUserId = req.user?.userId;


  if (!taskId || !currentUserId) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const access = await checkTaskAccess(currentUserId, taskId);

    if (!access.canEdit) {
      return res.status(403).json({ message: "No access to this task" });
    }

    req.taskAccess = access;
    next();
  } catch (error) {
    console.error("Task access check failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
