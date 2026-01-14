import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
// 1. 아이콘 import는 잘 하셨습니다.
import { Home, Search, MessageCircle, User, Vote } from "lucide-react";

export function LeftSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems = [
    { name: "홈", path: "/", icon: Home },
    { name: "탐색", path: "/explore", icon: Search },
    { name: "메시지", path: "/messages", icon: MessageCircle },
    { name: "프로필", path: "/profile", icon: User },
  ];

  return (
    <nav className="flex flex-col gap-2">
      {menuItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-primary/10 text-primary font-bold"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium"
            }`}
          >
    
            <Icon 
              className="w-6 h-6" 
              strokeWidth={isActive ? 3 : 2} 
            />
            
            <span>{item.name}</span>
          </Link>
        );
      })}

      <Link to="/vote/create" className="mt-4">
        <Button className="w-full py-6 text-base rounded-xl shadow-lg gap-2 bg-primary hover:bg-primary/90 text-white font-bold">
          <Vote className="w-5 h-5" />
          투표 만들기
        </Button>
      </Link>
    </nav>
  );
}