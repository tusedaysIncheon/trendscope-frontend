import { UserAvatar } from "@/features/user/components/UserAvatar";
import { useTheme } from "@/shared/theme/theme-provider";
import { Button } from "@/shared/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { Bell, LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ useLocation 추가
import { toast } from "sonner";



// Shadcn UI Dropdown 컴포넌트
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useUser } from "@/features/user/hooks/useUser";

export function UserHeader() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const { setTheme, theme } = useTheme();
  const { data: user } = useUser();



  const handleLogout = async () => {
    try {
      await logout();
      toast.success("로그아웃 되었습니다.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("로그아웃에 실패했습니다.");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };



  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="relative flex h-[60px] items-center justify-between px-4 max-w-screen-xl mx-auto w-full">

        {/* 1. 로고 영역 (z-20으로 탭보다 위에 오게 설정) */}
        <a
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80 z-20"
        >
          <img
            src="/logo1.png"
            alt="TrendScope Logo"
            className="h-8 w-auto select-none"
          />
        </a>



        {/* 3. 우측 액션 영역 (z-20) */}
        <div className="flex items-center gap-2 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Bell className="!h-6 !w-6" strokeWidth={2.5} />
            <span className="sr-only">알림</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent focus-visible:ring-0"
              >
                <UserAvatar className="h-9 w-9 cursor-pointer transition-transform active:scale-95" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.nickname}님</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    환영합니다 👋
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>마이페이지</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>설정</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                {theme === "dark" ? (
                  <Moon className="mr-2 h-4 w-4" />
                ) : (
                  <Sun className="mr-2 h-4 w-4" />
                )}
                <span>테마 변경</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  );
}
