import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma-client";

export const UserController = {
  register: async (req: Request, res: Response): Promise<any> => {
    const { firstName, lastName, middleName, login, password, managerId } =
      req.body;

    if (!firstName || !lastName || !login || !password) {
      return res.status(400).json({ message: "Invalid data" });
    }

    try {
      const isExistUser = await prisma.user.findUnique({
        where: { login },
      });

      if (isExistUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user: User = await prisma.user.create({
        data: {
          firstName,
          lastName,
          middleName,
          login,
          password: passwordHash,
          managerId,
        },
      });
      const { password: hashedPassword, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.log("Error in register", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  login: async (req: Request, res: Response): Promise<any> => {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ message: "Invalid data" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          login,
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid login" });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_SECRET_KEY!,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_SECRET_KEY!,
        { expiresIn: "7d" }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ accessToken });
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getAllUsers: async (req: Request, res: Response): Promise<any> => {
    try {
      const users = await prisma.user.findMany();
      const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
      res.status(200).json(usersWithoutPassword);
    } catch (error) {
      console.error("Ошибка при получении всех пользователей:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  refreshToken: async (req: Request, res: Response): Promise<any> => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is missing" });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY!);

      const newAccessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.ACCESS_SECRET_KEY!,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error("Ошибка при обновлении токена:", error);
      res.status(401).json({ message: "Invalid refresh token" });
    }
  },

  logout: async (req: Request, res: Response): Promise<any> => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({
        message: "REFRESH TOKEN IS NOT DEFINED",
      });
    }
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(200).json({ message: "Выход выполнен успешно" });
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  },
};
