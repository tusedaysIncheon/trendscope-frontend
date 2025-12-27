import type { UserRequestDTO, UserResponseDTO } from "@/types/user";
import { axiosInstance } from "./axiosInstance";

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

export async function getMyInfoAPI(): Promise<UserResponseDTO> {
  try {
    const response = await axiosInstance.get<UserResponseDTO>("/v1/user");
    return response.data;
  } catch (error: any) {
    console.error("내정보조회 실패:", error);
    throw new Error("사용자 정보를 불러오지 못했습니다.");
  }
}

export async function updateNicknameAPI(nickname: string) {
  try {
    const response = await axiosInstance.patch("/v1/user/nickname", {
      nickname,
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ 닉네임 변경 실패:", error);
    throw new Error(
      error?.response?.data?.message || "닉네임 변경 중 오류가 발생했습니다."
    );
  }
}

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

export async function loginAPI(username: string, password: string) {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }
  try {
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
  } catch (error: any) {
    console.log("로그인실패", error);
    throw new Error(
      error.response?.data?.messeage || "로그인에 실패하였습니다."
    );
  }
}

export async function logoutAPI() {
  try {
    await axiosInstance.post("/logout");
  } catch (err) {
    console.warn("로그아웃 요청 중 오류 발생 (무시하고 진행):", err);
  }
}
