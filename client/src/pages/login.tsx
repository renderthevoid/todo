import axiosClient from "@/api/axiosClient";
import { FormContainer } from "@/components/shared/";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  className?: string;
}
interface LoginErrorResponse {
  message: string;
}
const initialFormState = {
  password: "",
  login: "",
};
const formDataSchema = z.object({
  password: z
    .string()
    .min(3, { message: "Поле должно содержать не менее 3 символов" }),
  login: z
    .string()
    .min(3, { message: "Поле должно содержать не менее 3 символов" }),
});

type FormData = z.infer<typeof formDataSchema>;

export const Login: React.FC<Props> = ({ className }) => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: { ...initialFormState },
  });

  const formSubmitHandler = async (data: FormData) => {
    try {
      const response = await axiosClient.post("/api/login", data);
      const { accessToken, userId } = response.data;
      login(accessToken, userId);
      await navigate("/", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<LoginErrorResponse>;

        if (axiosError.response?.data) {
          const { message } = axiosError.response.data;

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
      }
    }
  };

  const showToast = (message: string) => {
    toast.error(message, {
      className: "p-2 rounded-lg bg-green-500 text-white",
      duration: 5000,
    });
  };

  return (
    <div className={className}>
      <div>
        <FormContainer submit={handleSubmit(formSubmitHandler)}>
          <h1 className="text-lg text-center">Вход</h1>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login">Логин</Label>
              <Input
                id="login"
                type="text"
                {...register("login")}
                placeholder="Введите логин"
              />
              {errors.login && (
                <span className="text-red-500 text-sm">
                  {errors.login.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="text"
                {...register("password")}
                placeholder="Введите пароль"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>
          <Button type="submit" className="cursor-pointer">
            Войти
          </Button>
          <Button variant="link" asChild>
            <Link to="/register">Регистрация</Link>
          </Button>
        </FormContainer>
      </div>
    </div>
  );
};
