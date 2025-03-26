import { User } from '@prisma/client';
import { UserController, TaskController } from "@/controllers";
import express from "express";
import auth from '@/middleware/auth';

const router = express.Router();

/*User*/
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/refresh-token", UserController.refreshToken);
router.post("/logout", auth, UserController.logout);
router.get("/users", UserController.getAllUsers);

router.get("/tasks", auth, TaskController.getTasks);
router.post("/createTask", auth, TaskController.createTask);


export default router;
