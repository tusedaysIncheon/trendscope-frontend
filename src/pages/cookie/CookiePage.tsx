import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

function CookiePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCookie2Body = async () => {
      try {
        const exchangeResponse = await fetch(
          `${BACKEND_API_BASE_URL}/jwt/exchange`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!exchangeResponse.ok) throw new Error("쿠키 처리 실패");

        const result = await exchangeResponse.json();
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);

        // 로그인 처리 성공 후 닉네임 관련 유저정보 조회
        const userResponseInfo = await fetch(
          `${BACKEND_API_BASE_URL}/v1/user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${result.accessToken}`,
            },
          }
        );

        if (!userResponseInfo.ok) throw new Error("유저 정보 조회 실패");

        const userInfo = await userResponseInfo.json();
        console.log("🔥 유저 응답:", userInfo);

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

  return <div></div>;
}

export default CookiePage;
