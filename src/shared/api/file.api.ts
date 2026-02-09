import { axiosInstance } from "@/lib/api/axiosInstance";
import axios from "axios";
import type { ApiResponse } from "@/types/api";

//이미지 업로드용 S3 presignedUrl 요청 API
export async function getPresignedUrlAPI(
    filename: string,
    folder: "profileImage" | "contentImage" | "votepic" | "options"
) {
    try {
        const response = await axiosInstance.post<ApiResponse<any>>("/v1/s3/presigned-url", {
            filename,
            folder,
        });

        return response.data.data;
    } catch (error) {
        console.warn("이미지 업로드 실패:", error);
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
