import { Link, useLocation } from "react-router-dom";
// 1. 사용할 아이콘 import
import { Home, Search, MessageCircle, User, Vote } from "lucide-react";

export function MobileNav() {
  const location = useLocation();
  const pathname = location.pathname;

  // 활성화된 탭인지 확인하는 헬퍼 함수
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 px-6 py-2 z-50 pb-safe  bg-white dark:bg-[#09090b] z-50">
      <div className="flex items-center justify-between relative max-w-md mx-auto h-16">
        
        {/* 홈 */}
        <Link to="/" className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-400'}`}>
          <Home 
            className="w-6 h-6" 
            strokeWidth={isActive('/') ? 3 : 2} 
            fill={isActive('/') ? "currentColor" : "none"} 
          />
          <span className="text-[10px] font-medium">홈</span>
        </Link>

        {/* 탐색 (Search) */}
        <Link to="/explore" className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive('/explore') ? 'text-primary' : 'text-gray-400'}`}>
          <Search 
            className="w-6 h-6" 
            strokeWidth={isActive('/explore') ? 3 : 2} 
          />
          <span className="text-[10px] font-medium">탐색</span>
        </Link>

        {/* [중앙] 투표 만들기 (플로팅 버튼) */}
        <div className="group flex items-center justify-center -mt-2">
          <Link to="/vote/create" className="relative flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-[0_8px_16px_rgba(25,25,230,0.3)] hover:shadow-[0_12px_20px_rgba(25,25,230,0.4)] transform hover:scale-105 transition-all border-4 border-white dark:border-[#1e1e2d]">
            <Vote className="w-7 h-7" />
          </Link>
        </div>

        {/* 메시지 */}
        <Link to="/messages" className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive('/messages') ? 'text-primary' : 'text-gray-400'}`}>
          <MessageCircle 
            className="w-6 h-6" 
            strokeWidth={isActive('/messages') ? 3 : 2}
            fill={isActive('/messages') ? "currentColor" : "none"} 
          />
          <span className="text-[10px] font-medium">메시지</span>
        </Link>

        {/* 프로필 */}
        <Link to="/profile" className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive('/profile') ? 'text-primary' : 'text-gray-400'}`}>
          <User 
            className="w-6 h-6" 
            strokeWidth={isActive('/profile') ? 3 : 2}
            fill={isActive('/profile') ? "currentColor" : "none"} 
          />
          <span className="text-[10px] font-medium">프로필</span>
        </Link>
        
      </div>
    </nav>
  );
}