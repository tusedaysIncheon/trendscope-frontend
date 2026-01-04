import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { PageLayout } from "@/components/layouts/PageLayout";
import { useAuthStore } from "@/store/useAuthStore";

const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

function CookiePage() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuthStore();
  

  useEffect(() => {
    const fetchCookie2Body = async () => {
      try {
        const deviceId = localStorage.getItem("deviceId") || "unknown-device";
        const exchangeResponse = await fetch(
          `${BACKEND_API_BASE_URL}/jwt/exchange`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ deviceId : deviceId}),
          }
        );

        if (!exchangeResponse.ok) throw new Error("쿠키 처리 실패");

        const result = await exchangeResponse.json();
        const accessToken = result.accessToken

        // 로그인 처리 성공 후 닉네임 관련 유저정보 조회
        const userResponseInfo = await fetch(
          `${BACKEND_API_BASE_URL}/v1/user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!userResponseInfo.ok) throw new Error("유저 정보 조회 실패");

        const userInfo = await userResponseInfo.json();
        console.log("🔥 유저 응답:", userInfo);

       setAccessToken(accessToken);
       setUser(userInfo);

        if (userInfo.needsNickname) {
          navigate("/nickname");
        } else {
          toast.success(`${userInfo.nickname ?? "회원"}님 환영합니다!`);
          navigate("/");
        }
      } catch (error) {
        toast.error("로그인 처리에 실패했습니다. 다시 시도해주세요.");
        navigate("/login");
      }
    };

    fetchCookie2Body();
  }, [navigate]);

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
