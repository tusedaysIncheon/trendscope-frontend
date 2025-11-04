import { existUserApi, signUpApi } from "@/lib/api/UserApi";
import type { UserRequestDTO } from "@/types/user";
import { useCallback } from "react";
import { toast } from "sonner";

export function useRegiForm(form: any) {
  const onSubmit = useCallback(
    async (data: UserRequestDTO) => {
      try {
        const result = await signUpApi(data);
        toast.success(`${result.nickname}님 회원가입을 축하드립니다! 🎉`, {
          description: "이제 로그인하고 투표하러 갈까요? 🗳️",
        });
        form.reset();
      } catch (error) {
        toast.error("회원가입 실패 😢", {
          description: "입력 정보를 다시 확인해주세요.",
        });
      }
    },
    [form]
  );

  const checkUsernameExists = useCallback(async (username: string) => {
    if (!username) return;
    try {
      const exist = await existUserApi(username);
      if (exist) toast.error("이미 사용 중인 아이디입니다. 😢");
      else toast.success("사용 가능한 아이디입니다! 🎉");
    } catch {
      toast.error("아이디 중복 확인에 실패했습니다. 😢");
    }
  }, []);

  const handleBlurUsername = useCallback(
    (value: string) => {
      if (value.trim()) checkUsernameExists(value.trim());
    },
    [checkUsernameExists]
  );

  return { onSubmit, handleBlurUsername };


}
