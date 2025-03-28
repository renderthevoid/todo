import { useState } from "react";
import { z } from "zod";

export const useForm = <T extends Record<string, unknown>>(
  initialData: Partial<T> = {} as Partial<T>,
  schema: z.ZodSchema<T>
) => {
  const [formData, setFormData] = useState<Partial<T>>({ ...initialData });

  const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateSelect = (field: keyof T, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateAndSubmit = (data: unknown) => {
    const res = schema.safeParse(data);
    if (res.success) {
      return undefined;
    }
    return res.error.format();
  };

  return {
    formData,
    updateInput,
    updateSelect,
    validateAndSubmit,
  };
};
