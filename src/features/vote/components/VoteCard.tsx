import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { MessageCircle, MoreHorizontal } from "lucide-react";

import type { VoteData } from "@/types/vote";
import { getFullImageUrl } from "@/shared/utils/image";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { VoteDetailModal } from "./VoteDetailModal";
import { VoteOptionList } from "./VoteOptionList";
import { useVoteMutation } from "../hooks/useVoteMutation";
import { UserAvatar } from "@/features/user/components/UserAvatar";

interface VoteCardProps {
  data: VoteData;
}

export function VoteCard({ data }: VoteCardProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: vote } = useVoteMutation();

  const handleVote = (voteOptionId: number, e?: React.MouseEvent) => {
    e?.stopPropagation(); // 카드 클릭(모달 열기) 방지

    vote({ voteId: data.id, optionId: voteOptionId });
  };


  const totalVotes = data.totalVote;

  return (
    <>
      <Card
        className="w-full max-w-xl border-border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Header: Compact padding */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <UserAvatar
              className="w-9 h-9 border-border"
              imageUrl={data.writer.avatarUrl}
              nickname={data.writer.nickname}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-foreground leading-none">
                  {data.writer.nickname}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
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
                src={getFullImageUrl(data.imageUrl)}
                alt="Vote Content"
                className="w-full h-auto object-cover max-h-[400px]"
              />
            </div>
          )}

          {/* Vote Options: Logic for Grid vs List */}
          <VoteOptionList
            options={data.options}
            totalVotes={data.totalVote}
            votedOptionId={data.votedOptionId}
            isVoted={data.votedOptionId !== null}
            selectedOptionId={data.votedOptionId}
            onVote={handleVote}
          />
        </CardContent>

        {/* Footer: Minimized padding */}
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span>{totalVotes.toLocaleString()}명 참여</span>
            <span className="text-[10px]">•</span>
            <span className="text-primary/90">
              {formatDistanceToNow(new Date(data.endDate), { addSuffix: true, locale: ko })} 종료
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-foreground gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="text-xs">{data.commentCount}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <VoteDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
      />
    </>
  );
}