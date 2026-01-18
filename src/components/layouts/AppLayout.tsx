import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"
import { UserHeader } from "@/components/layouts/headers/UserHeader"
import { GuestHeader } from "@/components/layouts/headers/GuestHeader"
import { LeftSidebar } from "@/components/layouts/sidebars/LeftSidebar"
import { RightSidebar } from "@/components/layouts/sidebars/RightSidebar"
import { MobileNav } from "@/components/layouts/navbars/navbaruser/NavBarMobile"
import { useAuthStore } from "@/store/useAuthStore"

export default function AppLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isMember = isAuthenticated;

  return (
    <div className="relative flex flex-col min-h-screen w-full">
      
      {isMember ? <UserHeader /> : <GuestHeader />}

      <div className="w-full max-w-md mx-auto sm:max-w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl pt-[60px]">
        
        <main className="flex-1 flex flex-col gap-8 px-0 pb-24 md:px-4 lg:grid lg:grid-cols-12 lg:gap-14 lg:px-4 pt-2 md:pt-6 items-start">
          
          {/* [좌측 사이드바 수정] 
              1. pt-12 삭제 -> 중앙 탭과 시작 높이 맞춤
              2. top-24 -> top-[80px] : 스크롤 시 헤더 바로 밑에 예쁘게 붙음
          */}
          <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-[80px] h-fit self-start">
            {isMember && <LeftSidebar />}
          </aside>

          {/* 중앙 컨텐츠 */}
          <div className="w-full flex flex-col gap-8 lg:col-span-6 min-h-[500px]">
             <Outlet />
          </div>

          {/* [우측 사이드바 수정] 
              1. pt-12 삭제
              2. top-24 -> top-[80px]
          */}
          <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-[80px] h-fit self-start">
            {isMember && <RightSidebar />}
          </aside>

        </main>
      </div>

      {isMember && <MobileNav />}
      <Toaster richColors position="top-center" />
      <div className="h-safe-bottom bg-transparent lg:hidden"></div>
    </div>
  )
}