import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFashionRecommendation,
  getFashionRecommendationHistory,
  getFashionRecommendationHistoryDetail,
} from "@/features/measurement/api/fashionRecommendation.api";
import { queryKeys } from "@/lib/queryKeys";
import type {
  FashionRecommendationHistoryDetailResponse,
  FashionRecommendationHistoryListResponse,
  FashionRecommendationRequest,
  FashionRecommendationResponse,
} from "@/types/trendscope";

export function useFashionRecommendationHistory(size = 20) {
  return useQuery<FashionRecommendationHistoryListResponse>({
    queryKey: queryKeys.measurement.recommendationHistory(size),
    queryFn: () => getFashionRecommendationHistory(size),
    staleTime: 30_000,
  });
}

export function useFashionRecommendationHistoryDetail(userSeq: number | null) {
  return useQuery<FashionRecommendationHistoryDetailResponse>({
    queryKey: queryKeys.measurement.recommendationHistoryDetail(userSeq ?? -1),
    queryFn: () => getFashionRecommendationHistoryDetail(userSeq as number),
    enabled: typeof userSeq === "number" && userSeq > 0,
    staleTime: 30_000,
  });
}

export function useCreateFashionRecommendationMutation() {
  const queryClient = useQueryClient();

  return useMutation<FashionRecommendationResponse, Error, FashionRecommendationRequest>({
    mutationFn: createFashionRecommendation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.measurement.root });
    },
  });
}
