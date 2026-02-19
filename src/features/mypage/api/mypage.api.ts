import { requestData } from "@/lib/api/request";
import type { MyPageSummaryResponse } from "@/types/trendscope";

interface MyPageSummaryParams {
  ticketSize?: number;
  analyzeSize?: number;
}

export async function getMyPageSummary(
  params: MyPageSummaryParams = {}
): Promise<MyPageSummaryResponse> {
  const { ticketSize = 20, analyzeSize = 20 } = params;

  return requestData<MyPageSummaryResponse>(
    {
      url: "/v1/mypage/summary",
      method: "GET",
      params: { ticketSize, analyzeSize },
    },
    "마이페이지 정보를 불러오지 못했습니다."
  );
}
