import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/global/UserAvatar";
import { cn } from "@/lib/utils";
import type { VoteData } from "@/types/vote";


interface VoteCardProps {
  data: VoteData;
}

export function VoteCard({ data }: VoteCardProps) {
  // 로컬 상태: 투표 했는지 안했는지 (실제로는 API 연동 필요)
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isVoted, setIsVoted] = useState(false);

  // 투표 핸들러
  const handleVote = (optionId: number) => {
    if (isVoted) return; // 이미 투표했으면 막기
    setSelectedOptionId(optionId);
    setIsVoted(true);
    // TODO: 여기서 백엔드로 투표 API 요청 보내야 함
  };

  return (
    <article className="w-full bg-white dark:bg-[#1e1e2d] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all hover:shadow-md">

      {/* 1. 헤더: 작성자 정보 */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <UserAvatar className="w-10 h-10 border border-gray-100 dark:border-gray-700" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">
              {data.writer.nickname}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-500">@{data.writer.handle}</span>
              <span className="text-[10px] text-gray-300">•</span>
              <span className="text-xs text-gray-400">{data.createdDate}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* 2. 본문: 질문 내용 */}
      <div className="px-4 py-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug mb-4">
          {data.content}
        </h3>

        {/* 3. 투표 옵션 영역 */}
        <div className="flex flex-col gap-2.5">
          {data.options.map((option) => {
            // 퍼센트 계산
            const percentage = isVoted
              ? Math.round((option.count + (selectedOptionId === option.id ? 1 : 0)) / (data.totalVoteCount + 1) * 100)
              : 0;

            const isSelected = selectedOptionId === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                disabled={isVoted}
                className={cn(
                  "relative w-full h-12 rounded-xl text-left transition-all overflow-hidden border",
                  // 투표 전 스타일
                  !isVoted && "bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 border-gray-200 dark:border-zinc-700",
                  // 투표 후 스타일 (선택 안 한 것)
                  isVoted && !isSelected && "bg-gray-50 dark:bg-zinc-800/30 border-transparent opacity-60",
                  // 투표 후 스타일 (내가 선택한 것)
                  isSelected && "border-primary font-bold ring-1 ring-primary"
                )}
              >
                {/* 배경 그래프 바 (투표 후에만 보임) */}
                {isVoted && (
                  <div
                    className={cn(
                      "absolute top-0 left-0 h-full transition-all duration-700 ease-out opacity-20",
                      isSelected ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                {/* 텍스트 내용 */}
                <div className="relative z-10 flex items-center justify-between px-4 w-full h-full">
                  <span className={cn(
                    "text-sm",
                    isSelected ? "text-primary font-bold" : "text-gray-700 dark:text-gray-300"
                  )}>
                    {option.text}
                  </span>

                  {isVoted && (
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {percentage}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. 하단: 정보 및 액션 버튼 */}
      <div className="px-4 py-3 mt-2">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
          <span>{data.totalVoteCount + (isVoted ? 1 : 0)}명 참여</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{data.timeLeft}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
          {/* 좋아요 */}
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 group">
            <Heart className={cn("w-5 h-5 transition-colors", data.isLiked && "fill-red-500 text-red-500")} />
            <span className="text-xs">{data.likeCount}</span>
          </Button>

          {/* 댓글 */}
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">{data.commentCount}</span>
          </Button>

          {/* 공유 */}
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </article>
  );
}