import axiosClient from "@/api/axiosClient";
import { FormContainer } from "@/components/shared/";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
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
  const [userFormData, setFormData] = useState<Partial<FormData>>({});
  const [showErrors, setShowErrors] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const formData = {
    ...initialFormState,
    ...userFormData,
  };

  const validate = () => {
    const res = formDataSchema.safeParse(formData);
    if (res.success) {
      return undefined;
    }
    return res.error.format();
  };

  const errors = showErrors ? validate() : undefined;

  const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;
    setFormData((prevValue) => ({
      ...prevValue,
      [name]: inputValue,
    }));
  };

  const formSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isErrors = validate();

    if (isErrors) {
      setShowErrors(true);
      return;
    }

    try {
      const response = await axiosClient.post("/api/login", formData);
      const { accessToken } = response.data;
      login(accessToken);
      await navigate("/", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<LoginErrorResponse>;

        if (axiosError.response?.data) {
          const { message } = axiosError.response.data;

          if (message === "Invalid login") {
            showToast("Неверный логин");
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
        <FormContainer submit={(e) => formSubmitHandler(e)}>
          <h1 className="text-lg text-center">Вход</h1>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login">Логин</Label>
              <Input
                id="login"
                type="text"
                name="login"
                value={formData.login}
                onChange={updateInput}
                placeholder="Введите логин"
              />
              <span className="text-red-500 text-sm">
                {errors?.login?._errors.join(", ")}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="text"
                name="password"
                value={formData.password}
                onChange={updateInput}
                placeholder="Введите пароль"
              />
              <span className="text-red-500 text-sm">
                {errors?.password?._errors.join(", ")}
              </span>
            </div>
          </div>
          <Button type="submit" className="cursor-pointer">
            Войти
          </Button>
          <Button variant="link">
            <Link to="/register">Регистрация</Link>
          </Button>
        </FormContainer>
      </div>
    </div>
  );
};
