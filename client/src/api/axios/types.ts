import type { AxiosError, AxiosRequestConfig } from "axios";


export interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}


export interface AxiosAuthRefreshError extends AxiosError {
  config: RetryAxiosRequestConfig;
}


export interface RefreshTokenResponse {
  accessToken: string;
  userId: string;
  userRole: string;
}