import { TrendingUp } from "lucide-react"; // 트렌드 아이콘
import { UserAvatar } from "@/components/global/UserAvatar"; // 프로필 아바타 재사용
import { Button } from "@/components/ui/button"; // 버튼 컴포넌트 활용 (선택사항)

export function RightSidebar() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. 추천 팔로우 섹션 */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">추천 팔로우</h3>
        <div className="flex flex-col gap-4">
          {/* 가상의 친구 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* 회색 동그라미 대신 UserAvatar 사용 */}
              <UserAvatar className="w-9 h-9" /> 
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 dark:text-white">박민수</span>
                <span className="text-xs text-gray-500">@minsu_park</span>
              </div>
            </div>
            <button className="text-primary text-xs font-bold hover:underline">팔로우</button>
          </div>
          
          {/* 가상의 친구 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserAvatar className="w-9 h-9" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 dark:text-white">최지은</span>
                <span className="text-xs text-gray-500">@jieun_choi</span>
              </div>
            </div>
            <button className="text-primary text-xs font-bold hover:underline">팔로우</button>
          </div>
        </div>
      </div>

      {/* 2. 트렌드 섹션 */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" strokeWidth={2.5} />
          현재 투표 트렌드
        </h3>
        
        <ul className="flex flex-col gap-5">
          <li className="flex items-start gap-3 cursor-pointer group">
            <span className="text-primary font-bold text-base w-4 leading-snug">1</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                주 4일제 도입 찬반
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">급상승 중 🔥</span>
            </div>
          </li>
          
          <li className="flex items-start gap-3 cursor-pointer group">
            <span className="text-primary font-bold text-base w-4 leading-snug">2</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                민트초코 호불호 투표
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">1.2만명 참여</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}