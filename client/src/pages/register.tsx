import axiosClient from "@/api/axiosClient";
import { FormContainer, SelectItems } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { z } from "zod";

interface Props {
  className?: string;
}
const initialFormState = {
  login: "",
  password: "",
  middleName: "",
  firstName: "",
  lastName: "",
};
const formDataSchema = z.object({
  password: z.string().min(3, { message: "Обязательное поле" }),
  login: z.string().min(3, { message: "Обязательное поле" }),
  firstName: z.string().min(2, { message: "Обязательное поле" }),
  middleName: z.string().min(3, { message: "Обязательное поле" }),
  lastName: z.string().min(3, { message: "Обязательное поле" }),
});

export const Register: React.FC<Props> = ({ className }) => {
  const navigate = useNavigate();

  const [userFormData, setFormData] = useState<Partial<FormData>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedManager, setSelectedManager] = useState<string | null>(null);

  const formData = {
    ...initialFormState,
    ...userFormData,
    managerId: selectedManager,
  };

  const fetchAllUsers = async () => {
    const res = await axiosClient.get("/api/users");
    setUsers(res.data);
  };

  useEffect(() => {
    try {
      fetchAllUsers();
    } catch (error) {
      console.error(error);
    }
  }, []);

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

  const formHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isErrors = validate();

    if (isErrors) {
      setShowErrors(true);
      return;
    }
    try {
      const response = await axiosClient.post("/api/register", formData);
      if (response.status === 200) {
        toast.success("Регистрация прошла успешно", {
          className: "p-2 rounded-lg bg-green-500 text-white",
          duration: 5000,
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
      toast.error("Ошибка регистрации", {
        className: "p-2 rounded-lg bg-green-500 text-white",
        duration: 5000,
      });
    }
  };
  return (
    <div className={cn(className)}>
      <FormContainer submit={(e) => formHandler(e)}>
        <h1 className="text-lg text-center">Регистрация</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lastName">Фамилия</Label>
            <Input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={updateInput}
              placeholder="Введите фамилию"
            />
            <span className="text-red-500 text-sm">
              {errors?.lastName?._errors.join(", ")}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName">Имя</Label>
            <Input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={updateInput}
              placeholder="Введите имя"
            />
            <span className="text-red-500 text-sm">
              {errors?.firstName?._errors.join(", ")}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="middleName">Отчество</Label>
            <Input
              id="middleName"
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={updateInput}
              placeholder="Введите отчество"
            />
            <span className="text-red-500 text-sm">
              {errors?.middleName?._errors.join(", ")}
            </span>
          </div>
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

          <div className="flex flex-col gap-1.5">
            <Label>Руководитель</Label>
            <SelectItems
              items={users}
              title="Ваш руководитель"
              placeholder="Выберите руководителя"
              className="w-full"
              onSelected={setSelectedManager}
            ></SelectItems>
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
