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
      await useAuthStore.getState().logout(); // 서버 요청 없이 클라이언트 상태만 비움
      return Promise.reject(error);
    }

    // ✅ 여기서부터 "Silent Refresh" 로직 시작
    originalRequest._retry = true; // 재시도 플래그 설정

    try {

      const deviceId = localStorage.getItem("deviceId");

      const refreshResponse = await axios.post(
        `${API}/jwt/refresh`,
        { deviceId },
        { withCredentials: true }
      );

      const newAccessToken = refreshResponse.data.accessToken;
      useAuthStore.getState().setAccessToken(newAccessToken);

      try {
        const userResponse = await axiosInstance.get("/v1/user", {
          headers: { Authorization: `Bearer ${newAccessToken}` },
        });

        useAuthStore.getState().setUser(userResponse.data);
      } catch (userError) {
        console.warn("유저 정보 복구 실패(치명적이지 않음):", userError);
      }

      // 4. 원래 실패했던 요청의 헤더 교체 후 재요청
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      console.error("토큰 재발급 실패 -> 로그아웃", refreshError);
      await useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    }
  }
);
