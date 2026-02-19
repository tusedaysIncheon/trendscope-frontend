import axios from "axios";
import { requestData } from "@/lib/api/request";
import type {
  AnalyzeJobListResponse,
  AnalyzeJobStartRequest,
  AnalyzeJobStartResponse,
  AnalyzeJobStatusResponse,
  AnalyzeUploadUrlsRequest,
  AnalyzeUploadUrlsResponse,
} from "@/types/trendscope";

export async function issueAnalyzeUploadUrls(
  payload: AnalyzeUploadUrlsRequest
): Promise<AnalyzeUploadUrlsResponse> {
  return requestData<AnalyzeUploadUrlsResponse, AnalyzeUploadUrlsRequest>(
    {
      url: "/v1/analyze/jobs/upload-urls",
      method: "POST",
      data: payload,
    },
    "업로드 URL 발급 중 오류가 발생했습니다."
  );
}

export async function uploadFileToPresignedUrl(uploadUrl: string, file: File): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });
}

export async function startAnalyzeJob(
  jobId: string,
  payload: AnalyzeJobStartRequest
): Promise<AnalyzeJobStartResponse> {
  return requestData<AnalyzeJobStartResponse, AnalyzeJobStartRequest>(
    {
      url: `/v1/analyze/jobs/${jobId}/start`,
      method: "POST",
      data: payload,
    },
    "측정 시작 요청 중 오류가 발생했습니다."
  );
}

export async function getAnalyzeJobStatus(jobId: string): Promise<AnalyzeJobStatusResponse> {
  return requestData<AnalyzeJobStatusResponse>(
    {
      url: `/v1/analyze/jobs/${jobId}`,
      method: "GET",
    },
    "측정 상태 조회 중 오류가 발생했습니다."
  );
}

export async function getMyAnalyzeJobs(size = 20): Promise<AnalyzeJobListResponse> {
  return requestData<AnalyzeJobListResponse>(
    {
      url: "/v1/analyze/jobs/me",
      method: "GET",
      params: { size },
    },
    "측정 목록 조회 중 오류가 발생했습니다."
  );
}
