import { TaskController, UserController } from "@/controllers";
import { auth, taskAccess } from "@/middleware";

import express from "express";

const router = express.Router();

/*User*/
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/refresh-token", UserController.refreshToken);
router.post("/logout", auth, UserController.logout);
router.get("/available-users", auth, UserController.getAvailableUsers);
router.get("/users", UserController.getAllUsers);

router.get("/tasks", auth, TaskController.getTasks);
router.post("/createTask", auth, TaskController.createTask);
router.get("/tasks/:id", auth, TaskController.getTaskById);
router.put("/tasks/:id", auth, taskAccess, TaskController.updateTaskById);

export default router;
