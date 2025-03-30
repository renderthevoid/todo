import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <RegisterForm className="w-full max-w-md" />
    </div>
  );
};