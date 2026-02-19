import { axiosInstance } from "@/lib/api/axiosInstance";
import axios from "axios";
import type { ApiResponse } from "@/types/api";
import { getApiErrorMessage } from "@/lib/api/error";

export type PresignedUrlPayload = {
    presignedUrl: string;
    fileKey: string;
};

//이미지 업로드용 S3 presignedUrl 요청 API
export async function getPresignedUrlAPI(
    filename: string,
    folder: "profileImage" | "contentImage" | "boatpic" | "options"
): Promise<PresignedUrlPayload> {
    try {
        const response = await axiosInstance.post<ApiResponse<PresignedUrlPayload>>("/v1/s3/presigned-url", {
            filename,
            folder,
        });

        return response.data.data;
    } catch (error: unknown) {
        console.warn("이미지 업로드 실패:", error);
        throw new Error(getApiErrorMessage(error, "이미지 업로드 URL 생성에 실패했습니다."));
    }
}

//요청 presignedUrl 로 파일 업로드 요청 API
export async function uploadToS3(presignedUrl: string, file: File) {
    await axios.put(presignedUrl, file, {
        headers: {
            "Content-Type": file.type,
        },
    });
}
