import logo from "@/assets/logo.png";
import { UserAvatar } from "@/components/global/UserAvatar";
import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { Bell, LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ useLocation 추가
import { toast } from "sonner";
import { cn } from "@/lib/utils"; // ✅ cn 유틸 추가
import { useFeedStore } from "@/store/useFeedStore"; // ✅ 스토어 import

// Shadcn UI Dropdown 컴포넌트
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";

export function UserHeader() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 현재 주소 가져오기
  const { setTheme, theme } = useTheme();
  const { data: user } = useUser();
  
  // ✅ 전역 스토어에서 탭 상태 가져오기
  const { activeTab, setActiveTab } = useFeedStore();

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

  // ✅ 홈 화면("/")인지 체크
  const isHomePage = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="relative flex h-[60px] items-center justify-between px-4 max-w-screen-xl mx-auto w-full">
        
        {/* 1. 로고 영역 (z-20으로 탭보다 위에 오게 설정) */}
        <a
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80 z-20"
        >
          <img
            src={logo}
            alt="The WDUW Logo"
            className="h-8 w-auto select-none"
          />
        </a>

        {/* 🟢 2. 중앙 탭 (홈 화면일 때만 표시) */}
        {isHomePage && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[240px]">
             {/* 높이 36px (h-9) */}
            <div className="relative flex w-full bg-gray-100 dark:bg-zinc-800 rounded-lg p-1 h-9">
              {/* 슬라이딩 배경 애니메이션 */}
              <div 
                className={cn(
                  "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-black rounded-[5px] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]",
                  activeTab === "rec" ? "translate-x-0" : "translate-x-full"
                )}
              />
              
              <button
                onClick={() => setActiveTab("rec")}
                className={cn(
                  "flex-1 relative z-10 text-xs sm:text-sm font-bold transition-colors duration-200",
                  activeTab === "rec" ? "text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700"
                )}
              >
                추천
              </button>
              
              <button
                onClick={() => setActiveTab("following")}
                className={cn(
                  "flex-1 relative z-10 text-xs sm:text-sm font-bold transition-colors duration-200",
                  activeTab === "following" ? "text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700"
                )}
              >
                팔로잉
              </button>
            </div>
          </div>
        )}

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