export type UserRequestDTO = {
  username: string;
  password?: string;
  email?: string;
};

export type LoginRequestDTO = {
  username: string;   // "아이디를 입력하세요"
  password: string;   // "비밀번호를 입력하세요"
};

export type UserResponseDTO = {
  username: string;   // 로그인 아이디
  email: string;      // 이메일
  isSocial: boolean;  // 소셜 가입 여부
};

export type AuthLoginResponseDTO = {
  accessToken: string;
  user: UserResponseDTO;
};

export interface UserLoadDTO {
  username: string;
  email: string;
  isSocial: boolean;

  nickname?: string;
  imageUrl?: string;
  needsProfileSetup: boolean;
}
