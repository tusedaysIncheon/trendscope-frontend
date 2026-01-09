import { z } from 'zod';

export const loginSchema = z.object({
    username: z
    .string()
    .min(5, "아이디는 5글자 이상 입력해주세요.")
    .max(20, "아이디는 20자 이하여야합니다."),
    password: z
    .string()
    .min(1,"비밀번호를 입력해주세요."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;