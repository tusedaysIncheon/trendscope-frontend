import { cn } from "@/lib/utils";

export type TabType = "rec" | "following";

interface HomeTabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function HomeTabNavigation({ activeTab, onTabChange }: HomeTabNavigationProps) {
  return (
    <div className="sticky top-[60px] z-30 py-3 px-4 border-b border-transparent">
      
      {/* [수정 포인트]
        기존 p-1을 제거하고, 내부에서 간격을 처리합니다.
        overflow-hidden을 줘서 둥근 모서리를 깔끔하게 처리합니다.
      */}
      <div className="relative flex w-full bg-gray-100 dark:bg-zinc-800 rounded-xl h-12 overflow-hidden">
        
        {/* [배경 슬라이더]
          1. w-1/2: 부모의 정확히 절반 크기
          2. translate-x: 0% 또는 100% (수학적으로 완벽함)
          3. p-1: 슬라이더 내부에서 패딩을 줘서 흰색 박스가 작아 보이게 만듦 (시각적 간격)
        */}
        <div 
          className={cn(
            "absolute top-0 bottom-0 w-1/2 transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] p-1",
            activeTab === "rec" ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* 실제 흰색 박스 */}
          <div className="w-full h-full bg-white dark:bg-black rounded-lg shadow-sm" />
        </div>

        {/* 탭 1: 추천 */}
        <button
          onClick={() => onTabChange("rec")}
          className={cn(
            "flex-1 relative z-10 text-sm font-bold transition-colors duration-200",
            activeTab === "rec" ? "text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700"
          )}
        >
          🔥 추천 투표
        </button>

        {/* 탭 2: 팔로잉 */}
        <button
          onClick={() => onTabChange("following")}
          className={cn(
            "flex-1 relative z-10 text-sm font-bold transition-colors duration-200",
            activeTab === "following" ? "text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700"
          )}
        >
          👥 팔로잉
        </button>
      </div>
    </div>
  );
}