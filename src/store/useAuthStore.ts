import { create } from "zustand";
import type { UserResponseDTO } from "@/types/user";

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
  
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
}));