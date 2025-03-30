import { AuthService } from "@/api/services/auth.service";
import { UserService } from "@/api/services/user.service";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type {
  RegisterErrorResponse,
  RegisterFormData,
  UserOption,
} from "../../types/auth.types";
import { mapUsersToOptions } from "./RegisterForm.utils";
import { User } from '@/types';

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);

  const fetchAllUsers = async () => {
    try {
      const users = await UserService.getAllUsers();
      setUserOptions(mapUsersToOptions(users as User[]));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await AuthService.register(data);
      showToast("Регистрация прошла успешно", "success");
      navigate("/login");
    } catch (error) {
      handleRegisterError(error);
    }
  };

  const handleRegisterError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<RegisterErrorResponse>;
      const message = axiosError.response?.data.message;
      showToast(message || "Ошибка регистрации", "error");
    } else {
      showToast("Неизвестная ошибка", "error");
    }
  };

  const showToast = (message: string, type: "success" | "error" = "error") => {
    toast[type](message, {
      className: `p-2 rounded-lg ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`,
      duration: 5000,
    });
  };

  return { handleRegister, userOptions };
};
