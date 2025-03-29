import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      taskAccess?: TaskAccess
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.headers["authorization"];
  const accessToken = headerToken && headerToken.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Не авторизован" });
  }

  try {
    if (accessToken) {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_SECRET_KEY!
      ) as UserPayload;
      req.user = decoded;
      return next();
    }
  } catch (accessError) {
    if (!refreshToken) {
      return res.status(401).json({ message: "Недействительный токен" });
    }
    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_KEY!
      ) as UserPayload;
      const newAccessToken = jwt.sign(
        { userId: decodedRefresh.userId },
        process.env.ACCESS_SECRET_KEY!,
        { expiresIn: "15m" }
      );

      res.setHeader("Authorization", `Bearer ${newAccessToken}`);
      req.user = decodedRefresh;
      return next();
    } catch (refreshError) {
      return res
        .status(403)
        .clearCookie("refreshToken")
        .json({ message: "Недействительный refresh token" });
    }
  }
};