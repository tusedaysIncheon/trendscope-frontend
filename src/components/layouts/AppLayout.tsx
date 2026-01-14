import { useLocation, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"

// 페이지 컴포넌트들
import IndexPage from "@/pages/index/IndexPage"
import LoginPage from "@/pages/auth/LoginPage"
import SignUpPage from "@/pages/auth/SignUpPage"
import CookiePage from "@/pages/cookie/CookiePage"
import ProfileSetupPage from "@/pages/auth/ProfileSetupPage"
import LayoutGuidePage from "@/pages/examples/LayoutGuidePage"

// 레이아웃 컴포넌트들
import { UserHeader } from "@/components/layouts/headers/UserHeader"
import { GuestHeader } from "@/components/layouts/headers/GuestHeader"
import { NavbarGuest } from "@/components/layouts/navbars/NavBarGuest"
import { NavbarUser } from "@/components/layouts/navbars/navbaruser/NavBarUser"
import { useAuthStore } from "@/store/useAuthStore"

export default function AppLayout() {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  // 게스트(비로그인) 헤더/네비를 보여줄 경로 정의
  const guestPaths = ["/", "/login", "/signup", "/cookie", "/profile-setup", "/dev/layout-guide"]
  // 현재 경로가 게스트 경로에 포함되는지 확인 (로그인 안 했을 때만 체크)
  const isGuestPage = !isAuthenticated && guestPaths.includes(location.pathname)

  return (
    // 1. 전체 앱 래퍼 (배경색 및 최소 높이 설정)
    <div className="flex flex-col min-h-screen bg-background text-foreground font-display antialiased">
      
      {/* 2. 상단 헤더 */}
      {/* UserHeader는 내부적으로 sticky top-0을 가질 예정이므로 별도 스타일 불필요 */}
      {isAuthenticated ? <UserHeader /> : <GuestHeader />}

      {/* 3. 메인 콘텐츠 영역 */}
      {/* 기존의 padding 계산 로직 제거 -> 페이지별로 알아서 레이아웃 잡도록 flex-1 w-full만 부여 */}
      <main className="flex-1 flex flex-col w-full mx-auto">
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/cookie" element={<CookiePage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/dev/layout-guide" element={<LayoutGuidePage />} />
        </Routes>
      </main>

      {/* 4. 하단 네비게이션 (모바일용) */}
      {/* NavbarUser는 내부적으로 fixed bottom-0을 가질 예정 */}
      {isAuthenticated ? <NavbarUser /> : isGuestPage && <NavbarGuest />}

      {/* 5. 토스트 메시지 (알림) */}
      <Toaster richColors position="top-center" />
    </div>
  )
}