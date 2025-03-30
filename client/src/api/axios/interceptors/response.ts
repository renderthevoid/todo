import axios, { AxiosResponse } from "axios";
import type { AxiosAuthRefreshError } from "../types";
import type { RefreshTokenResponse } from "../types";
import {useAuthStore} from "@/store";


export const responseInterceptor = (response: AxiosResponse) => {
  return response;
};


export const errorInterceptor = async (error: AxiosAuthRefreshError) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const response = await axios.post<RefreshTokenResponse>(
        "http://localhost:3000/api/refresh-token",
        null,
        { withCredentials: true }
      );

      const { accessToken, userId, userRole } = response.data;
      const { login } = useAuthStore.getState();
      login(accessToken, userId, userRole);
      
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      
      return axios(originalRequest);
    } catch (refreshError) {
      console.error("Refresh token error:", refreshError);
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
};