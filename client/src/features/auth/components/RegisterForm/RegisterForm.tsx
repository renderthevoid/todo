import { FormContainer, SelectItems } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { RegisterFormData } from "../../types/auth.types";
import { formDataSchema, initialFormState } from "./schema";
import { useRegisterForm } from "./useRegisterForm";

interface RegisterFormProps {
  className?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ className }) => {
  const { handleRegister, userOptions } = useRegisterForm();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: initialFormState,
  });

  return (
    <div className={className}>
      <FormContainer submit={handleSubmit(handleRegister)}>
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
            <Label htmlFor="login">Пароль</Label>
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
              items={userOptions}
              title="Ваш руководитель"
              placeholder="Выберите руководителя"
              className="w-full"
              value={watch("managerId")}
              onSelected={(value) => setValue("managerId", value)}
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
