import { useQuery } from "@tanstack/react-query";
import { getMyPageSummary } from "@/features/mypage/api/mypage.api";
import { queryKeys } from "@/lib/queryKeys";
import type { MyPageSummaryResponse } from "@/types/trendscope";

interface UseMyPageSummaryOptions {
  ticketSize?: number;
  analyzeSize?: number;
}

export function useMyPageSummary(options: UseMyPageSummaryOptions = {}) {
  const ticketSize = options.ticketSize ?? 20;
  const analyzeSize = options.analyzeSize ?? 20;

  return useQuery<MyPageSummaryResponse>({
    queryKey: queryKeys.mypage.summary(ticketSize, analyzeSize),
    queryFn: () => getMyPageSummary({ ticketSize, analyzeSize }),
    staleTime: 15_000,
  });
}
