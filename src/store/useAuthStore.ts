import { create } from "zustand";
import type { UserResponseDTO } from "@/types/user";
import { axiosInstance } from "@/lib/api/axiosInstance";

interface AuthState {
  user: UserResponseDTO | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // 액션 (상태 변경 함수들)
  setAccessToken: (token: string) => void;
  setUser: (user: UserResponseDTO | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
  setUser: (user) => set({ user }),
  
  logout: async () => {
    try {
        await axiosInstance.post('v1/user/logout');
    } catch(error) {
      console.error("로그아웃 요청 실패:", error);
    } finally {
    set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },
}));