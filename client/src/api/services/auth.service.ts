import { axiosClient } from "@/api/axios";

type LoginCredentials = {
  login: string;
  password: string;
};

type RegisterFormData = {
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  managerId?: string;
};

type AuthResponse = {
  accessToken: string;
  userId: string;
  userRole: string;
};

type RefreshTokenResponse = AuthResponse;

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>("/api/login", credentials);
    return response.data;
  },

  async register(userData: RegisterFormData): Promise<void> {
    const payload = {
      ...userData,
      managerId: userData.managerId || null
    };
    await axiosClient.post("/api/register", payload);
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await axiosClient.post<RefreshTokenResponse>(
      "/api/refresh-token",
      null,
      { withCredentials: true }
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await axiosClient.post("/api/logout");
  }
};