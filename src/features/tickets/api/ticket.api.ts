import { requestData } from "@/lib/api/request";
import type {
  TicketSummaryResponse,
  TicketTransactionRequest,
  TicketTransactionResponse,
} from "@/types/trendscope";

export async function purchaseTicket(payload: TicketTransactionRequest): Promise<TicketTransactionResponse> {
  return requestData<TicketTransactionResponse, TicketTransactionRequest>(
    {
      url: "/v1/tickets/purchase",
      method: "POST",
      data: payload,
    },
    "티켓 구매 처리 중 오류가 발생했습니다."
  );
}

export async function consumeTicket(payload: TicketTransactionRequest): Promise<TicketTransactionResponse> {
  return requestData<TicketTransactionResponse, TicketTransactionRequest>(
    {
      url: "/v1/tickets/use",
      method: "POST",
      data: payload,
    },
    "티켓 사용 처리 중 오류가 발생했습니다."
  );
}

export async function refundTicket(payload: TicketTransactionRequest): Promise<TicketTransactionResponse> {
  return requestData<TicketTransactionResponse, TicketTransactionRequest>(
    {
      url: "/v1/tickets/refund",
      method: "POST",
      data: payload,
    },
    "티켓 환불 처리 중 오류가 발생했습니다."
  );
}

export async function getMyTicketSummary(size = 20): Promise<TicketSummaryResponse> {
  return requestData<TicketSummaryResponse>(
    {
      url: "/v1/tickets/me",
      method: "GET",
      params: { size },
    },
    "티켓 정보를 불러오지 못했습니다."
  );
}
