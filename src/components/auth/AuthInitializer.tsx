import { useAuthStore } from "@/store/useAuthStore";
import { useAuthInit } from "@/hooks/queries/useAuthInit";
import { LoadingPage } from "../global/LoadingPage";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken } = useAuthStore();

  // 토큰이 없을 때만(false일 때만) 초기화 로직 실행
  const { isLoading } = useAuthInit(!accessToken);

  if (isLoading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
}