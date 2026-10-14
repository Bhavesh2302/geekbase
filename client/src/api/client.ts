import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { ApiResponse, ApiErrorResponse } from '../types/api';

export class AppApiError extends Error {
  statusCode: number;
  errors?: Array<{ field: string; message: string }>;
  timestamp?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: Array<{ field: string; message: string }>,
    timestamp?: string
  ) {
    super(message);
    this.name = 'AppApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.timestamp = timestamp;
  }

  getFieldError(field: string): string | undefined {
    return this.errors?.find((e) => e.field === field)?.message;
  }
}

const resolveApiBaseUrl = (): string => {
  const customUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;
  if (!customUrl) {
    return '/api/v1';
  }
  const cleanUrl = customUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-Protection': '1',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const data = error.response.data;
      const statusCode = error.response.status;
      const message =
        data?.message ||
        (statusCode === 401
          ? 'Authentication required. Please sign in.'
          : statusCode === 403
            ? 'You do not have permission to perform this action.'
            : statusCode === 404
              ? 'The requested resource was not found.'
              : statusCode >= 500
                ? 'A server error occurred. Please try again later.'
                : 'Request failed. Please check your inputs.');

      return Promise.reject(
        new AppApiError(
          message,
          statusCode,
          data?.errors,
          data?.timestamp
        )
      );
    } else if (error.request) {
      return Promise.reject(
        new AppApiError(
          'Network error: Unable to connect to server. Please check your internet connection.',
          0
        )
      );
    }

    return Promise.reject(new AppApiError(error.message || 'An unexpected error occurred.'));
  }
);

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data.data;
  },

  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  },
};
