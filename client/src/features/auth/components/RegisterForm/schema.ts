import { z } from "zod";
import { RegisterFormData } from '../../types/auth.types';


export const initialFormState: RegisterFormData = {
  login: "",
  password: "",
  middleName: "",
  firstName: "",
  lastName: "",
  managerId: "",
};

export const formDataSchema = z.object({
  password: z.string().min(3, "Поле должно содержать не менее 3 символов"),
  login: z.string().min(3, "Поле должно содержать не менее 3 символов"),
  firstName: z.string().min(2, "Поле должно содержать не менее 2 символов"),
  middleName: z.string().min(3, "Поле должно содержать не менее 3 символов"),
  lastName: z.string().min(3, "Поле должно содержать не менее 3 символов"),
  managerId: z.string().optional(),
});