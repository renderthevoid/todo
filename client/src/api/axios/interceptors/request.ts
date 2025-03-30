import type { RetryAxiosRequestConfig } from "../types";

export const requestInterceptor = (config: RetryAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};