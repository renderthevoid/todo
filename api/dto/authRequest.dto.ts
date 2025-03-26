import { Request } from "express";

export interface User {
  userId: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

