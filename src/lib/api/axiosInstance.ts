import axios from "axios";
import type {  InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API = import.meta.env.VITE_BACKEND_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  _retry?: boolean;
}

axiosInstance.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token && !config.skipAuth) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (!originalRequest) return Promise.reject(error);

    const requestUrl = originalRequest.url ?? "";

    if (error.response?.status !== 401) return Promise.reject(error);

    if (requestUrl.includes("/login") || requestUrl.includes("/jwt/refresh") || requestUrl.includes("/logout")) {
      await useAuthStore.getState().clearSession; // 서버 요청 없이 클라이언트 상태만 비움
      return Promise.reject(error);
    }

    // "Silent Refresh" 로직 시작
    originalRequest._retry = true; // 재시도 플래그 설정

    try {

      const deviceId = localStorage.getItem("deviceId");

      const refreshResponse = await axios.post(
        `${API}/jwt/refresh`,
        { deviceId },
        { withCredentials: true }
      );

      const newAccessToken = refreshResponse.data.accessToken;
      
      if(!newAccessToken){

        console.warn("리프레시 요청은 성공(200)했으나, 토큰이 없는 Guest 상태입니다. 로그아웃 처리합니다.");
        throw new Error("Guest Mode: No Access Token");
      
      }

      useAuthStore.getState().setAccessToken(newAccessToken);

      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      console.error("토큰 재발급 실패 -> 로그아웃", refreshError);
      await useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    }
  }
);
