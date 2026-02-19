import { requestData } from "@/lib/api/request";
import type { CreemCheckoutCreateRequest, CreemCheckoutCreateResponse } from "@/types/trendscope";

export async function createCreemCheckout(
  payload: CreemCheckoutCreateRequest
): Promise<CreemCheckoutCreateResponse> {
  return requestData<CreemCheckoutCreateResponse, CreemCheckoutCreateRequest>(
    {
      url: "/v1/payments/creem/checkout",
      method: "POST",
      data: payload,
    },
    "결제 링크 생성 중 오류가 발생했습니다."
  );
}
