import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { MessageCircle, Share2, MoreHorizontal, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VoteData } from "@/types/vote";
import { useUser } from "@/features/user/hooks/useUser";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface VoteCardProps {
  data: VoteData;
}

export function VoteCard({ data }: VoteCardProps) {
  const { data: user } = useUser();
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(data.votedOptionId);
  const [isVoted, setIsVoted] = useState<boolean>(data.votedOptionId !== null);

  // 내 글인지 확인
  const isMe = user?.userId === data.writer.id;
  // 팔로우 버튼 노출 조건: 내가 아니고, 팔로우하지 않은 상태
  const showFollowButton = !isMe && !data.writer.isFollowing;

  const handleVote = (optionId: number) => {
    if (isVoted) return;

    // TODO: API 호출 구현 필요
    setSelectedOptionId(optionId);
    setIsVoted(true);
  };

  const handleFollow = () => {
    // TODO: 팔로우 API 호출
    console.log("Follow user:", data.writer.id);
  };

  const totalVotes = data.totalVotes + (isVoted && data.votedOptionId === null ? 1 : 0);

  return (
    <Card className="w-full max-w-xl border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header: Compact padding */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 border border-border">
            <AvatarImage src={data.writer.avatarUrl || undefined} alt={data.writer.nickname} />
            <AvatarFallback>{data.writer.nickname[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground leading-none">
                {data.writer.nickname}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showFollowButton && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs px-3 rounded-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
              onClick={handleFollow}
            >
              팔로우
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>신고하기</DropdownMenuItem>
              <DropdownMenuItem>공유하기</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Body: Compact spacing */}
      <CardContent className="px-4 py-3 pb-1 space-y-3">
        {/* Content Text */}
        <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {data.content}
        </p>

        {/* Image (Conditional) */}
        {data.imageUrl && (
          <div className="rounded-lg overflow-hidden border border-border/50">
            <img
              src={data.imageUrl}
              alt="Vote Content"
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </div>
        )}

        {/* Vote Options: Logic for Grid vs List */}
        {(() => {
          // 옵션 중 하나라도 이미지가 있는지 확인
          const hasImageOptions = data.options.some(opt => opt.imageUrl);

          if (hasImageOptions) {
            // 🟦 GRID LAYOUT (이미지 있을 때)
            return (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {data.options.map((option) => {
                  const currentCount = option.count + (selectedOptionId === option.id && data.votedOptionId === null ? 1 : 0);
                  const percentage = totalVotes > 0 ? Math.round((currentCount / totalVotes) * 100) : 0;
                  const isSelected = selectedOptionId === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleVote(option.id)}
                      disabled={isVoted}
                      className={cn(
                        "relative flex flex-col items-center justify-center overflow-hidden rounded-xl border transition-all duration-200 aspect-[3/4]",
                        !isVoted && "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5",
                        isVoted && "border-transparent",
                        isVoted && !isSelected && "bg-muted/50 opacity-70",
                        isVoted && isSelected && "ring-2 ring-primary border-primary bg-primary/5"
                      )}
                    >
                      {/* Image background */}
                      {option.imageUrl ? (
                        <img
                          src={option.imageUrl}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">No Image</span>
                        </div>
                      )}

                      {/* Dark Overlay for text readability */}
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity",
                        isVoted ? "opacity-90 bg-black/50" : "opacity-60"
                      )} />

                      {/* Vote Result Overlay (Bar not suitable here, usually simple overlay style) */}
                      {isVoted && (
                        <div
                          className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      )}

                      {/* Content Layer */}
                      <div className="relative z-10 flex flex-col items-center justify-end w-full h-full p-3 text-center">
                        {isVoted && isSelected && (
                          <div className="mb-1 p-1 bg-primary rounded-full text-white">
                            <Check className="w-4 h-4" />
                          </div>
                        )}

                        <span className={cn(
                          "text-sm font-medium text-white line-clamp-2 drop-shadow-md",
                          isVoted && "text-white/90"
                        )}>
                          {option.text}
                        </span>

                        {isVoted && (
                          <span className="mt-1 text-lg font-bold text-white drop-shadow-md">
                            {percentage}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          } else {
            // 🟦 LIST LAYOUT (기존 텍스트 위주)
            return (
              <div className="flex flex-col gap-1.5 mt-1">
                {data.options.map((option) => {
                  const currentCount = option.count + (selectedOptionId === option.id && data.votedOptionId === null ? 1 : 0);
                  const percentage = totalVotes > 0 ? Math.round((currentCount / totalVotes) * 100) : 0;
                  const isSelected = selectedOptionId === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleVote(option.id)}
                      disabled={isVoted}
                      className={cn(
                        "relative w-full overflow-hidden rounded-lg border transition-all duration-200",
                        "group min-h-[40px] px-3 py-2 flex items-center justify-between",
                        !isVoted && "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                        isVoted && "border-transparent",
                        isVoted && !isSelected && "bg-muted/50 text-muted-foreground",
                        isVoted && isSelected && "ring-1 ring-primary bg-primary/5 text-primary font-medium"
                      )}
                    >
                      {/* Result Bar */}
                      {isVoted && (
                        <div
                          className={cn(
                            "absolute inset-y-0 left-0 transition-all duration-500 ease-out opacity-20",
                            isSelected ? "bg-primary" : "bg-muted-foreground"
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      )}

                      {/* Text and Check */}
                      <div className="relative z-10 flex items-center gap-2 text-left mr-2">
                        <span className="text-sm">{option.text}</span>
                        {isVoted && isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                      </div>

                      {/* Percentage */}
                      {isVoted && (
                        <span className="relative z-10 text-xs font-semibold">
                          {percentage}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          }
        })()}
      </CardContent>

      {/* Footer: Minimized padding */}
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground font-medium">
          {totalVotes.toLocaleString()}명 참여
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-foreground gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="text-xs">{data.commentCount}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}