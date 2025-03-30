export interface LoginErrorResponse {
  message: string;
}

export type LoginFormData = {
  password: string;
  login: string;
};

export interface RegisterErrorResponse {
  message: string;
}

export type RegisterFormData = {
  login: string;
  password: string;
  middleName: string;
  firstName: string;
  lastName: string;
  managerId?: string;
};

export type UserOption = {
  id: string;
  label: string;
};
