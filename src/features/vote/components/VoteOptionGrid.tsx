import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VoteOption } from "@/types/vote";

interface VoteOptionGridProps {
    options: VoteOption[];
    totalVotes: number;
    votedOptionId: number | null;
    isVoted: boolean;
    selectedOptionId: number | null;
    onVote: (optionId: number, e?: React.MouseEvent) => void;
}

export function VoteOptionGrid({
    options,
    totalVotes,
    votedOptionId,
    isVoted,
    selectedOptionId,
    onVote,
}: VoteOptionGridProps) {
    return (
        <div className="grid grid-cols-2 gap-2 mt-2">
            {options.map((option) => {
                // 낙관적 업데이트를 위한 로직: 내가 지금 막 투표한 항목이면 +1
                const currentCount =
                    option.count +
                    (selectedOptionId === option.id && votedOptionId === null ? 1 : 0);

                const percentage =
                    totalVotes > 0 ? Math.round((currentCount / totalVotes) * 100) : 0;

                const isSelected = selectedOptionId === option.id;

                return (
                    <button
                        key={option.id}
                        onClick={(e) => onVote(option.id, e)}
                        className={cn(
                            "relative flex flex-col items-center justify-center overflow-hidden rounded-xl border transition-all duration-200 aspect-[3/4]",
                            !isVoted &&
                            "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5",
                            isVoted && "border-transparent",
                            isVoted && !isSelected && "bg-muted/50 opacity-70",
                            isVoted &&
                            isSelected &&
                            "ring-2 ring-primary border-primary bg-primary/5"
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
                        <div
                            className={cn(
                                "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity",
                                isVoted ? "opacity-90 bg-black/50" : "opacity-60"
                            )}
                        />

                        {/* Vote Result Overlay */}
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

                            <span
                                className={cn(
                                    "text-sm font-medium text-white line-clamp-2 drop-shadow-md",
                                    isVoted && "text-white/90"
                                )}
                            >
                                {option.content}
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
}
