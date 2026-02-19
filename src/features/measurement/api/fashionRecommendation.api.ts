import { requestData } from "@/lib/api/request";
import type {
  FashionRecommendationHistoryDetailResponse,
  FashionRecommendationHistoryListResponse,
  FashionRecommendationRequest,
  FashionRecommendationResponse,
} from "@/types/trendscope";

export async function createFashionRecommendation(
  payload: FashionRecommendationRequest
): Promise<FashionRecommendationResponse> {
  return requestData<FashionRecommendationResponse, FashionRecommendationRequest>(
    {
      url: "/v1/measurement/fashion-recommendation",
      method: "POST",
      data: payload,
    },
    "패션 추천 생성 중 오류가 발생했습니다."
  );
}

export async function getFashionRecommendationHistory(
  size = 20
): Promise<FashionRecommendationHistoryListResponse> {
  return requestData<FashionRecommendationHistoryListResponse>(
    {
      url: "/v1/measurement/fashion-recommendation/history",
      method: "GET",
      params: { size },
    },
    "패션 추천 이력을 불러오지 못했습니다."
  );
}

export async function getFashionRecommendationHistoryDetail(
  userSeq: number
): Promise<FashionRecommendationHistoryDetailResponse> {
  return requestData<FashionRecommendationHistoryDetailResponse>(
    {
      url: `/v1/measurement/fashion-recommendation/history/${userSeq}`,
      method: "GET",
    },
    "패션 추천 상세를 불러오지 못했습니다."
  );
}
