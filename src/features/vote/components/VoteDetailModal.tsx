
import { X, MoreHorizontal, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getFullImageUrl } from "@/shared/utils/image";
import type { VoteData } from "@/types/vote";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Separator } from "@/shared/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/shared/ui/dialog";
import { VoteOptionList } from "./VoteOptionList";
import { VoteDemographics } from "./VoteDemographics";
import { VoteCommentList } from "./VoteCommentList";
import { VoteCommentInput } from "./VoteCommentInput";
import { useVoteMutation } from "../hooks/useVoteMutation";
import { useInsightAnchor } from "../hooks/useInsightAnchor";
import { UserAvatar } from "@/features/user/components/UserAvatar";



interface VoteDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: VoteData;
}

export function VoteDetailModal({ isOpen, onClose, data }: VoteDetailModalProps) {
    const { anchorOptionId, setAnchorOptionId, selectedOptionId, setSelectedOptionId } = useInsightAnchor({
        data,
        isOpen
    });

    const isVoted = data.votedOptionId !== null;
    const { mutate: vote } = useVoteMutation();

    const handleVote = (optionId: number) => {
        // Always update selection for viewing stats
        setSelectedOptionId(optionId);

        // Set anchor only if not set yet (Insight Anchor Logic)
        if (anchorOptionId === null) {
            setAnchorOptionId(optionId);
        }

        vote({ voteId: data.id, optionId });
    };



    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={cn(
                "p-0 gap-0 overflow-hidden",
                "w-full h-[100dvh] max-w-none rounded-none border-0", // Mobile: Full screen
                "sm:h-auto sm:max-h-[85vh] sm:max-w-xl sm:rounded-xl sm:border" // Desktop: Modal
            )} aria-describedby="vote-detail-desc">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 h-[56px]">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="sm:hidden -ml-2" onClick={onClose}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <DialogTitle className="text-base font-bold">투표 상세</DialogTitle>
                        <DialogDescription className="sr-only">
                            투표 상세 내용 및 분석 리포트를 확인하는 모달입니다.
                        </DialogDescription>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="hidden sm:inline-flex h-8 w-8">
                                <X className="w-5 h-5" />
                            </Button>
                        </DialogClose>
                    </div>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className="flex-1 h-[calc(100dvh-56px-70px)] sm:h-[calc(85vh-56px-70px)] bg-background">
                    <div className="flex flex-col pb-6">

                        {/* 1. Vote Content Section (User Info + Content) */}
                        <div className="p-5 pb-0">
                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-4">
                                <UserAvatar
                                    className="w-10 h-10 border"
                                    imageUrl={data.writer.avatarUrl}
                                    nickname={data.writer.nickname}
                                />
                                <div>
                                    <div className="font-bold text-sm">{data.writer.nickname}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true, locale: ko })}
                                    </div>
                                </div>
                                {!data.writer.isFollowing && (
                                    <Button variant="secondary" size="sm" className="ml-auto h-8 text-xs font-semibold rounded-full">
                                        팔로우
                                    </Button>
                                )}
                            </div>

                            {/* Vote Content */}
                            <h1 className="text-lg leading-snug mb-2 whitespace-pre-wrap">{data.content}</h1>

                            {/* Media if exists */}
                            {data.imageUrl && (
                                <div className="mt-3 mb-4 rounded-xl overflow-hidden border">
                                    <img src={getFullImageUrl(data.imageUrl)} alt="content" className="w-full object-cover max-h-[400px]" />
                                </div>
                            )}
                        </div>

                        {/* 2. Vote Options Section (Interactive) */}
                        <div className="px-5 py-2">
                            <VoteOptionList
                                options={data.options}
                                totalVotes={data.totalVote}
                                votedOptionId={data.votedOptionId}
                                isVoted={isVoted}
                                selectedOptionId={selectedOptionId}
                                onVote={handleVote}
                            />
                            <div className="pt-2 text-xs text-muted-foreground text-right border-b pb-6">
                                총 {data.totalVote.toLocaleString()}명 참여
                            </div>
                        </div>

                        {/* 3. Demographics Section (Visible only when option selected) */}
                        {selectedOptionId && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards">
                                <VoteDemographics
                                    data={data}
                                    votedOptionId={anchorOptionId}
                                    selectedOptionId={selectedOptionId}
                                />
                            </div>
                        )}

                        <Separator className="h-2 bg-muted/20" />


                        {/* 5. Comments List */}
                        <VoteCommentList commentCount={data.commentCount || 5} />

                    </div>
                </ScrollArea>

                {/* Footer: Sticky Input */}
                <VoteCommentInput />

            </DialogContent>
        </Dialog>
    );
}
