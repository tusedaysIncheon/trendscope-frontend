import { axiosInstance } from "@/lib/api/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { VoteData, VoteRequest } from "@/types/vote";

// 1. 투표 생성
export async function createVoteApi(data: VoteRequest): Promise<VoteData> {
    const response = await axiosInstance.post<ApiResponse<VoteData>>("/v1/vote", data);
    return response.data.data;
}

// 2. 투표 피드 조회 (Gravity)
export async function getVoteFeedApi(page: number, size: number = 10): Promise<VoteData[]> {
    const response = await axiosInstance.get<ApiResponse<VoteData[]>>("/v1/vote", {
        params: { page, size },
    });
    return response.data.data;
}

// 3. 투표 상세 조회
export async function getVoteDetailApi(voteId: number): Promise<VoteData> {
    const response = await axiosInstance.get<ApiResponse<VoteData>>(`/v1/vote/${voteId}`);
    return response.data.data;
}

// 4. 투표 참여
export async function castVoteApi(voteId: number, optionId: number): Promise<void> {
    await axiosInstance.post<ApiResponse<void>>(`/v1/vote/${voteId}`, {
        optionId,
    });
}

