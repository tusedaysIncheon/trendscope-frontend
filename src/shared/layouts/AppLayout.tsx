import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"
import { UserHeader } from "@/shared/layouts/headers/UserHeader"
import { GuestHeader } from "@/shared/layouts/headers/GuestHeader"
import { useAuthStore } from "@/store/useAuthStore"

export default function AppLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isMember = isAuthenticated;

  return (
    <div className="relative flex flex-col min-h-screen w-full">

      {isMember ? <UserHeader /> : <GuestHeader />}

      <div className="w-full max-w-md mx-auto sm:max-w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl pt-[60px]">

        <main className="flex-1 flex flex-col gap-8 px-0 pb-24 md:px-4 lg:grid lg:grid-cols-12 lg:gap-14 lg:px-4 pt-2 md:pt-6 items-start">

          {/* 중앙 컨텐츠 (사이드바 제거로 col-span 전체 사용 혹은 중앙 정렬 유지) */}
          {/* 기존: lg:col-span-6 -> 변경: lg:col-span-12 (전체 너비 사용) 또는 중앙 집중형 디자인에 맞게 조정 */}
          <div className="w-full flex flex-col gap-8 lg:col-span-12 min-h-[500px]">
            <Outlet />
          </div>

        </main>
      </div>

      <Toaster richColors position="top-center" />
      <div className="h-safe-bottom bg-transparent lg:hidden"></div>
    </div>
  )
}