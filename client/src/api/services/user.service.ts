import { axiosClient } from "@/api/axios";

type User = {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: string;
};

export const UserService = {
  async getAvailableUsers(): Promise<User[]> {
    const response = await axiosClient.get<User[]>("/api/available-users");
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await axiosClient.get<User>("/api/me");
    return response.data;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await axiosClient.get<User[]>("/api/users");
    return response.data;
  },
};
