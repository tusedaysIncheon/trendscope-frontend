import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageLayout } from "@/shared/layouts/PageLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { getDeviceId } from "@/lib/utils";
import { getUserLoadInfo } from "@/features/user/api/user.api";
import { useQueryClient } from "@tanstack/react-query";

const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

function CookiePage() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchCookie2Body = async () => {
      try {
        const deviceId = getDeviceId();
        const exchangeResponse = await fetch(
          `${BACKEND_API_BASE_URL}/jwt/exchange`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ deviceId: deviceId }),
          }
        );

        if (!exchangeResponse.ok) throw new Error("쿠키 처리 실패");

        const result = await exchangeResponse.json();
        const accessToken = result?.data?.accessToken;

        if (!accessToken) throw new Error("액세스 토큰이 없습니다.");

        setAccessToken(accessToken);

        // 로그인 처리 성공 후 닉네임 관련 유저정보 조회
        const userResponseInfo = await getUserLoadInfo();

        // setUser 대신 queryClient로 캐시 업데이트
        queryClient.setQueryData(["user"], userResponseInfo);

        if (userResponseInfo.needsProfileSetup) {
          navigate("/profile-setup", { replace: true });
        } else {
          toast.success(
            `${userResponseInfo.nickname ?? "회원"}님 환영합니다!`
          );
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("쿠키 로그인 처리 실패:", error);
        toast.error("로그인 처리에 실패했습니다. 다시 시도해주세요.");
        navigate("/login", { replace: true });
      }
    };

    fetchCookie2Body();
  }, [navigate, setAccessToken, queryClient]);

  return (
    <PageLayout
      variant="centered"
      contentWidth="sm"
      contentClassName="items-center text-center gap-4"
      className="md:py-16"
    >
      <h1 className="text-2xl font-semibold">로그인 처리 중입니다</h1>
      <p className="text-sm text-muted-foreground">
        잠시만 기다려 주세요. 자동으로 다음 페이지로 이동합니다.
      </p>
    </PageLayout>
  );
}

export default CookiePage;
