import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// In production (when deployed), use relative URLs so nginx can proxy them
// In development, use the environment variable or default to localhost
const isProduction = import.meta.env.PROD;
const API_URL = isProduction 
  ? '' // Empty string means relative URLs - nginx will proxy /auth requests
  : (import.meta.env.VITE_API_URL || 'http://localhost:8080');

console.log("🚀 ~ API_URL:", API_URL)

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Skip token refresh for signin/signup endpoints - to handle 401 errors normally
    const isAuthEndpoint = originalRequest.url?.includes('/auth/profile') || originalRequest.url?.includes('/auth/signin') || originalRequest.url?.includes('/auth/signup');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post('/auth/refresh');
        processQueue(null, null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

