import { create } from "zustand";
import { queryClient } from "@/lib/queryClient";
import { logoutAPI } from "@/features/auth/api/auth.api";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string | null) => void;
  logout: () => Promise<void>;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
  logout: async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error("로그아웃 요청 실패:", error);
    } finally {
      set({ accessToken: null, isAuthenticated: false });
      queryClient.removeQueries({ queryKey: ['user'], exact: true });
    }
  },
  clearSession: () => {
    set({ accessToken: null, isAuthenticated: false });
    queryClient.removeQueries({ queryKey: ['user'], exact: true });
  },
}));
