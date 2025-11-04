import { FcGoogle } from "react-icons/fc"
import { SiNaver } from "react-icons/si"

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

export function SocialLoginSection() {

    const handleSocialLogin = (provider : string) =>{
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  }

  return (
    <div className="w-full max-w-sm flex flex-col items-center justify-center gap-4 mt-6">
      <p className="text-sm text-muted-foreground">다른 서비스로 로그인</p>

      {/* 아이콘 버튼 묶음 */}
      <div className="flex items-center justify-center gap-4">
        {/* Google */}
        <button
          onClick={() => handleSocialLogin("google")}
          className="flex items-center justify-center w-10 h-10 rounded-md border bg-white hover:bg-gray-50 shadow-sm"
        >
          <FcGoogle className="text-2xl" />
        </button>

        {/* Naver */}
        <button
          onClick={ () => handleSocialLogin("naver")}
          className="flex items-center justify-center w-10 h-10 rounded-md border bg-[#03C75A] hover:bg-[#04b04f] shadow-sm"
        >
          <SiNaver className="text-white text-lg" />
        </button>
      </div>

      {/* 구분선 */}
      <div className="flex items-center w-full gap-2 pb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">또는</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    </div>
  )
}
