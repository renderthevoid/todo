import { LoginFormData } from "@/features/auth/types/auth.types";
import { z } from "zod";

export const initialFormState: LoginFormData = {
  password: "",
  login: "",
};

export const formDataSchema = z.object({
  password: z
    .string()
    .min(3, { message: "Поле должно содержать не менее 3 символов" }),
  login: z
    .string()
    .min(3, { message: "Поле должно содержать не менее 3 символов" }),
});
