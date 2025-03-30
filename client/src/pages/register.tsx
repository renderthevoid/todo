import axiosClient from "@/api/axiosClient";
import { FormContainer, SelectItems } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  className?: string;
}

interface RegisterErrorResponse {
  message: string;
}

const initialFormState = {
  login: "",
  password: "",
  middleName: "",
  firstName: "",
  lastName: "",
  managerId: "",
};

const formDataSchema = z.object({
  password: z
    .string()
    .min(3, { message: "Поле должно содержать не менее 3 символов" }),
  login: z
    .string()
    .min(3, { message: "Поле должно содержать не менее 3 символов" }),
  firstName: z
    .string()
    .min(2, { message: "Поле должно содержать не менее 2 символов" }),
  middleName: z
    .string()
    .min(3, { message: "Поле должно содержать не менее 3 символов" }),
  lastName: z
    .string()
    .min(3, { message: "Поле должно содержать не менее 3 символов" }),
  managerId: z
    .string()
    .optional()
});

type FormData = z.infer<typeof formDataSchema>;

export const Register: React.FC<Props> = ({ className }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: { ...initialFormState },
  });

  const fetchAllUsers = async () => {
    try {
      const res = await axiosClient.get("/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const formSubmitHandler = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        managerId: data.managerId || null, 
      };
      const response = await axiosClient.post("/api/register", payload);
      if (response.status === 200) {
        showToast("Регистрация прошла успешно", "success");
        navigate("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<RegisterErrorResponse>;

        if (axiosError.response?.data) {
          const { message } = axiosError.response.data;
          showToast(message || "Ошибка регистрации", "error");
        } else {
          showToast("Ошибка соединения с сервером", "error");
        }
      } else {
        showToast("Неизвестная ошибка", "error");
      }
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

  return (
    <div className={className}>
      <FormContainer submit={handleSubmit(formSubmitHandler)}>
        <h1 className="text-lg text-center">Регистрация</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lastName">Фамилия</Label>
            <Input
              id="lastName"
              type="text"
              {...register("lastName")}
              placeholder="Введите фамилию"
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm">
                {errors.lastName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName">Имя</Label>
            <Input
              id="firstName"
              type="text"
              {...register("firstName")}
              placeholder="Введите имя"
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">
                {errors.firstName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="middleName">Отчество</Label>
            <Input
              id="middleName"
              type="text"
              {...register("middleName")}
              placeholder="Введите отчество"
            />
            {errors.middleName && (
              <span className="text-red-500 text-sm">
                {errors.middleName.message}
              </span>
            )}
          </div>
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

          <div className="flex flex-col gap-1.5">
            <Label>Руководитель</Label>
            <SelectItems
              items={users}
              title="Ваш руководитель"
              placeholder="Выберите руководителя"
              className="w-full"
              value={watch("managerId")}
              onSelected={(value) => setValue("managerId", value)}
              getLabel={(user) =>
                `${user.lastName ?? ""} ${user.firstName ?? ""} ${
                  user.middleName ?? ""
                }`
              }
            />
          </div>
        </div>
        <Button type="submit" className="cursor-pointer">
          Регистрация
        </Button>
        <div className="flex items-center justify-center gap-1">
          <span>Уже есть аккаунт?</span>
          <Button variant="link" className="p-0" asChild>
            <Link to="/login">Войти</Link>
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};
