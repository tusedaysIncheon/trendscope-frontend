import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFullImageUrl } from "@/shared/utils/image";
import type { VoteOption } from "@/types/vote";

interface VoteOptionListProps {
    options: VoteOption[];
    totalVotes: number;
    votedOptionId: number | null; // 서버 데이터 기준 (혹은 초기값)
    isVoted: boolean; // 현재 투표 완료 여부
    selectedOptionId: number | null; // 현재 선택된 옵션 ID
    onVote: (optionId: number, e?: React.MouseEvent) => void;
}

export function VoteOptionList({
    options,
    totalVotes,
    votedOptionId,
    isVoted,
    selectedOptionId,
    onVote,
}: VoteOptionListProps) {
    // 옵션 중 하나라도 이미지가 있는지 확인
    const hasImageOptions = options.some((opt) => opt.imageUrl);

    if (hasImageOptions) {
        // 🟦 GRID LAYOUT (이미지 있을 때)
        return (
            <div className="grid grid-cols-2 gap-2 mt-2">
                {options.map((option) => {
                    // 낙관적 업데이트를 위한 로직: 상위 컴포넌트(VoteCard)에서 이미 업데이트된 데이터를 props로 전달받음
                    const currentCount = option.count;

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
                                    src={getFullImageUrl(option.imageUrl)}
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
                                    <div className="flex flex-col items-center mt-1">
                                        <span className="text-lg font-bold text-white drop-shadow-md">
                                            {percentage}%
                                        </span>
                                        <span className="text-xs text-white/90 font-medium drop-shadow-md">
                                            {currentCount}명
                                        </span>
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    } else {
        // 🟦 LIST LAYOUT (텍스트 위주)
        return (
            <div className="flex flex-col gap-1.5 mt-1">
                {options.map((option) => {
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
                                "relative w-full overflow-hidden rounded-lg border transition-all duration-200",
                                "group min-h-[40px] px-3 py-2 flex items-center justify-between",
                                !isVoted &&
                                "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                                isVoted && "border-transparent",
                                isVoted && !isSelected && "bg-muted/50 text-muted-foreground",
                                isVoted &&
                                isSelected &&
                                "ring-1 ring-primary bg-primary/5 text-primary font-medium"
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
                                <span className="text-sm">{option.content}</span>
                                {isVoted && isSelected && (
                                    <Check className="w-3.5 h-3.5 text-primary" />
                                )}
                            </div>

                            {/* Percentage */}
                            {isVoted && (
                                <div className="relative z-10 flex flex-col items-end ml-2">
                                    <span className="text-xs font-semibold">
                                        {percentage}%
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {currentCount}표
                                    </span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    }
}
