import logo from "@/assets/logo.png";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/global/UserAvatar";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function UserHeader() {

   const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("로그아웃 되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error("로그아웃에 실패했습니다.");
    } finally {
      navigate("/login");
    }
  };


  return (
    // [수정 포인트]
    // 1. z-50: 다른 요소들보다 무조건 위에 뜨게 함
    // 2. bg-background/80 -> bg-background: 투명도를 없애서 뒤에 카드가 안 비치게 함
    // (만약 약간 비치게 하고 싶다면 backdrop-blur-md가 있으니 /95 정도로 살짝만 투명하게 하세요)
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-[#09090b] shadow-sm">
      <div className="flex h-[60px] items-center justify-between px-4 max-w-screen-xl mx-auto w-full">
        <a
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <img
            src={logo}
            alt="The WDUW Logo"
            className="h-8 w-auto select-none"
          />
        </a>

        <div className="flex items-center gap-2">

            <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-4 active:scale-95 transition-transform"
          >
            로그아웃
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Bell className="!h-6 !w-6" strokeWidth={2.5} />
            <span className="sr-only">알림</span>
          </Button>

          <UserAvatar className="h-9 w-9" />
        </div>
      </div>
    </header>
  );
}