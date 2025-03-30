import { LoginForm } from "@/features/auth/components/LoginForm";

export const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm className="w-full max-w-md" />
    </div>
  );
};
