import { useAuthStore } from "../../store/useAuthStore";
import { useAuthInit } from "../../hooks/queries/useAuthInit";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuthStore();
  
  // 토큰이 없을 때만(false일 때만) 초기화 로직 실행
  const { isLoading } = useAuthInit(!accessToken);

  if (isLoading) {
    return <div>Loading...</div>; // 예쁜 스피너 컴포넌트로 교체 가능
  }

  return <>{children}</>;
}