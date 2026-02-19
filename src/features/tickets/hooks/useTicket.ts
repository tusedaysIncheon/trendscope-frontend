import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { consumeTicket, getMyTicketSummary, purchaseTicket, refundTicket } from "@/features/tickets/api/ticket.api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  TicketSummaryResponse,
  TicketTransactionRequest,
  TicketTransactionResponse,
} from "@/types/trendscope";

export function useTicketSummary(size = 20) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<TicketSummaryResponse>({
    queryKey: queryKeys.tickets.summary(size),
    queryFn: () => getMyTicketSummary(size),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}

function useInvalidateTicketQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.root }),
      queryClient.invalidateQueries({ queryKey: queryKeys.mypage.root }),
      queryClient.invalidateQueries({ queryKey: queryKeys.user }),
    ]);
  };
}

export function usePurchaseTicketMutation() {
  const invalidate = useInvalidateTicketQueries();

  return useMutation<TicketTransactionResponse, Error, TicketTransactionRequest>({
    mutationFn: purchaseTicket,
    onSuccess: invalidate,
  });
}

export function useUseTicketMutation() {
  const invalidate = useInvalidateTicketQueries();

  return useMutation<TicketTransactionResponse, Error, TicketTransactionRequest>({
    mutationFn: consumeTicket,
    onSuccess: invalidate,
  });
}

export function useRefundTicketMutation() {
  const invalidate = useInvalidateTicketQueries();

  return useMutation<TicketTransactionResponse, Error, TicketTransactionRequest>({
    mutationFn: refundTicket,
    onSuccess: invalidate,
  });
}
