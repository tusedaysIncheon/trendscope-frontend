import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castVoteApi } from "../api/vote.api";
import type { VoteData } from "@/types/vote";
import type { InfiniteData } from "@tanstack/react-query";

export function useVoteMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ voteId, optionId }: { voteId: number; optionId: number }) =>
            castVoteApi(voteId, optionId),

        onMutate: async ({ voteId, optionId }) => {
            // 1. 진행 중인 refetch 취소
            await queryClient.cancelQueries({ queryKey: ["votes"] });

            // 2. 이전 상태 스냅샷 (rollback용)
            const previousVotes = queryClient.getQueriesData<VoteData[]>({
                queryKey: ["votes"]
            });

            // 3. Optimistic update
            queryClient.setQueriesData<any>(
                { queryKey: ["votes"] },
                (old: any) => updateCacheData(old, voteId, optionId)
            );

            return { previousVotes };
        },

        onError: (_err, _vars, context) => {
            // Rollback: 이전 상태로 복원
            context?.previousVotes.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data);
            });
        },

        onSettled: () => {
            // 필요시 서버 동기화
            // queryClient.invalidateQueries({ queryKey: ["votes"] });
        },
    });
}

// ===== Helper Functions =====

/**
 * 투표 데이터 업데이트 (불변성 유지)
 */
function updateVote(vote: VoteData, voteId: number, optionId: number): VoteData {
    if (vote.id !== voteId) return vote;

    const oldVotedOptionId = vote.votedOptionId;

    // 같은 옵션 재선택 시 변경 없음
    if (oldVotedOptionId === optionId) return vote;

    // 옵션 카운트 업데이트
    const newOptions = vote.options.map((opt) => {
        if (opt.id === optionId) {
            return { ...opt, count: opt.count + 1 };
        }
        if (opt.id === oldVotedOptionId) {
            return { ...opt, count: Math.max(0, opt.count - 1) };
        }
        return opt;
    });

    // totalVote를 옵션 합계로 재계산 (데이터 일관성 보장)
    const newTotalVote = newOptions.reduce((sum, opt) => sum + opt.count, 0);

    return {
        ...vote,
        votedOptionId: optionId,
        options: newOptions,
        totalVote: newTotalVote,
    };
}

/**
 * 캐시 데이터 타입별 업데이트
 */
function updateCacheData(old: any, voteId: number, optionId: number): any {
    if (!old) return old;

    // 1. Infinite Query (InfiniteData)
    if (isInfiniteData(old)) {
        return {
            ...old,
            pages: old.pages.map((page: VoteData[]) =>
                page.map((vote) => updateVote(vote, voteId, optionId))
            ),
        };
    }

    // 2. List Query (Array)
    if (Array.isArray(old)) {
        return old.map((vote) => updateVote(vote, voteId, optionId));
    }

    // 3. Single Item Query (Object)
    if (isSingleVote(old)) {
        return updateVote(old, voteId, optionId);
    }

    return old;
}

/**
 * Type Guards
 */
function isInfiniteData(data: any): data is InfiniteData<VoteData[]> {
    return data?.pages && Array.isArray(data.pages);
}

function isSingleVote(data: any): data is VoteData {
    return data?.id !== undefined && data?.options !== undefined;
}