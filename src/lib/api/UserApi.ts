import type { UserRequestDTO, UserResponseDTO } from "@/types/user";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

// 회원 가입 API 호출
export async function signUpApi(userData: UserRequestDTO): Promise<UserResponseDTO> {
  
    try {
        const response = await fetch(`${API_BASE_URL}/v1/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
    
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`회원가입 실패 : ${errorText}`);
        }

        // 응답 데이터를 JSON 형태로 파싱
        const result: UserResponseDTO = await response.json();
        return result;
    }
    catch (error) {
        console.error("회원가입 중 오류 발생:", error);
        throw error;
    }
    
}