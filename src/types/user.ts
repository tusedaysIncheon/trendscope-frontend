export type UserRequestDTO = {
  username: string;
  password?: string;
  nickname?: string;
  email?: string;
};

export type UserResponseDTO = {
  username: string;
  isSocial: boolean;
  nickname: string;
  email: string;
};
