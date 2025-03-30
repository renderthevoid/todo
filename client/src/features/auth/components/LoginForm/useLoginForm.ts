import { AuthService } from "@/api/services";
import {
  LoginErrorResponse,
  LoginFormData,
} from "@/features/auth/types/auth.types";
import { useAuthStore } from "@/store";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (data: LoginFormData) => {
    try {
      const { accessToken, userId, userRole } = await AuthService.login(data);
      login(accessToken, userId, userRole);
      await navigate("/", { replace: true });
    } catch (error) {
      handleLoginError(error);
    }
  };

  const handleLoginError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<LoginErrorResponse>;
      const message = axiosError.response?.data.message;

      if (message === "Invalid login") {
        showToast("Пользователь не найден");
      } else if (message === "Invalid password") {
        showToast("Неверный пароль");
      } else {
        showToast("Произошла ошибка. Попробуйте снова.");
      }
    } else {
      showToast("Ошибка соединения с сервером");
    }
  };

  const showToast = (message: string) => {
    toast.error(message, {
      className: "p-2 rounded-lg bg-green-500 text-white",
      duration: 5000,
    });
  };

  return { handleLogin };
};
