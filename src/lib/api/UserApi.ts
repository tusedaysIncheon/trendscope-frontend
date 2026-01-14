import {
  type UserLoadDTO,
  type UserRequestDTO,
  type UserResponseDTO,
} from "@/types/auth";
import { axiosInstance } from "./axiosInstance";
import axios from "axios";
import type {
  UserDetailRequestDTO,
} from "@/types/profile";
import { getDeviceId } from "../utils";

// 회원 가입 API 호출
export async function signUpApi(
  userData: UserRequestDTO
): Promise<UserResponseDTO> {
  try {
    const response = await axiosInstance.post<UserResponseDTO>(
      "/v1/user",
      userData,
      { skipAuth: true }
    );

    return response.data;
  } catch (error: any) {
    console.error("회원가입 실패:", error);
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "회원가입 중 오류가 발생했습니다.";

    throw new Error(message);
  }
}
// 중복 검사 API 호출
export async function existUserApi(username: string): Promise<boolean> {
  try {
    const response = await axiosInstance.post(
      "/v1/user/exist",
      { username },
      { skipAuth: true }
    );

    const result = response.data;

    if (typeof result === "boolean") {
      return result;
    }

    if (result && typeof result.exist === "boolean") {
      return result.exist;
    }

    throw new Error("아이디 중복 검사 응답 형식을 확인해주세요.");
  } catch (error: any) {
    console.error("❌ 아이디 중복 검사 오류:", error);

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "아이디 중복 검사 중 오류가 발생했습니다.";

    throw new Error(message);
  }
}

//내정보조회 API
export async function getMyInfoAPI(): Promise<UserResponseDTO> {
  try {
    const response = await axiosInstance.get<UserResponseDTO>("/v1/user");
    return response.data;
  } catch (error: any) {
    console.error("내정보조회 실패:", error);
    throw new Error("사용자 정보를 불러오지 못했습니다.");
  }
}

//내정보수정 API
export async function updateMyInfoAPI(data: Partial<UserRequestDTO>) {
  try {
    const response = await axiosInstance.put("/v1/user", data);
    return response.data;
  } catch (error: any) {
    console.error("❌ 내 정보 수정 실패:", error);
    throw new Error(
      error?.response?.data?.message || "내 정보 수정 중 오류가 발생했습니다."
    );
  }
}

//회원탈퇴API
export async function deleteUserApi() {
  try {
    const response = await axiosInstance.delete("/v1/user");
    return response.data;
  } catch (error: any) {
    console.error("❌ 회원 탈퇴 실패:", error);
    throw new Error(
      error?.response?.data?.message || "회원 탈퇴 중 문제가 발생했습니다."
    );
  }
}

//로그인API
export async function loginAPI(username: string, password: string) {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }

  const response = await axiosInstance.post(
    "v1/user/login",
    {
      username,
      password,
      deviceId,
    },
    { skipAuth: true }
  );
  return response.data;
}

//로그아웃 API
export async function logoutAPI() {
  try {
    const deviceId = getDeviceId();
    await axiosInstance.post("v1/user/logout", {
      deviceId: deviceId,
    });
  } catch (err) {
    console.warn("로그아웃 요청 중 오류 발생 (무시하고 진행):", err);
  }
}

//이미지 업로드용 S3 presignedUrl 요청 API
export async function getPresignedUrlAPI(
  filename: string,
  folder: "profileImage" | "contentImage"
) {
  try {
    const response = await axiosInstance.post("/v1/s3/presigned-url", {
      filename,
      folder,
    });

    return response.data;
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

//유저 상세정보 저장 요청 API
export async function saveUserDetails(data: UserDetailRequestDTO) {
  const response = await axiosInstance.post("/v1/user-details", data);

  return response.data;
}

//유저 상세정보 불러오기 API
export async function getUserDetails() {
  const response = await axiosInstance.get<UserDetailRequestDTO>(
    "/v1/user-details"
  );
  return response.data;
}

//로그인 직후 스토어 저장용
export async function getUserLoadInfo() {
  const response = await axiosInstance.get<UserLoadDTO>("/v1/user/load-info");

  return response.data;
}
