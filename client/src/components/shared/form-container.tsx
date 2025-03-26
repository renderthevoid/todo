import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const FormContainer: React.FC<Props> = ({ className, children, submit }) => {
  return (
    <form
      onSubmit={submit}
      className={cn("max-w-xl m-auto h-screen", className)}
    >
      <div className="flex flex-col items-stretch justify-center gap-4 h-full">
        {children}
      </div>
    </form>
  );
};
