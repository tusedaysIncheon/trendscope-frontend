import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserResponseDTO } from "@/types/user";
import { axiosInstance } from "@/lib/api/axiosInstance";

interface AuthState {
  user: UserResponseDTO | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAccessToken: (token: string) => void;
  setUser: (user: UserResponseDTO | null) => void;
  logout: () => Promise<void>;
  clearSession: ()=> void;
}

// 2. persist로 감싸기
export const useAuthStore = create<AuthState>()(
  persist(
    (set,get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
      setUser: (user) => set({ user }),
      
      clearSession: () => {
        console.log("Store: 세션정보 초기화(서버요청없음)");
        set({ user: null, accessToken: null, isAuthenticated: false });
        localStorage.removeItem("auth-storage");
      },

      logout: async () => {
        try {
          await axiosInstance.post('v1/user/logout');
        } catch (error) {
          console.error("로그아웃 요청 실패:", error);
        } finally {
          
          set({ user: null, accessToken: null, isAuthenticated: false });
          get().clearSession();
        }
      },
    }),
    {
      name: "auth-storage", // 3. 로컬스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // 기본값이지만 명시적으로 작성
      
      // 4. ★ 핵심: 저장할 대상만 골라내기 (Whitelist) ★
      partialize: (state) => ({
        user: state.user, 
      }),
    }
  )
);