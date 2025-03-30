import { FormContainer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginFormData } from "@/features/auth/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { formDataSchema, initialFormState } from "./LoginForm.constants";
import { useLoginForm } from "./LoginForm.hooks";

interface LoginFormProps {
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ className }) => {
  const { handleLogin } = useLoginForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: initialFormState,
  });

  return (
    <div className={className}>
      <div>
        <FormContainer submit={handleSubmit(handleLogin)}>
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
                type="password"
                autoComplete="on"
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
