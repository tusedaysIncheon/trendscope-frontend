import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignUpFields() {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  return (
    <>
      <Input {...register("username")} placeholder="아이디" />
      {errors.username && (
        <p className="text-sm text-red-500">
          {errors.username.message?.toString()}
        </p>
      )}
      <Input {...register("password")} placeholder="비밀번호" type="password" />
      {errors.password && (
        <p className="text-sm text-red-500">
          {errors.password.message?.toString()}
        </p>
      )}
      <Input
        {...register("confirmPassword")}
        placeholder="비밀번호 확인"
        type="password"
      />
      {errors.confirmPassword && (
        <p className="text-sm text-red-500">
          {errors.confirmPassword.message?.toString()}
        </p>
      )}
      <Input {...register("nickname")} placeholder="닉네임" />
      {errors.nickname && (
        <p className="text-sm text-red-500">
          {errors.nickname.message?.toString()}
        </p>
      )}
      <Input {...register("email")} placeholder="이메일" />
       {errors.email && (
        <p className="text-sm text-red-500">
          {errors.email.message?.toString()}
        </p>
      )}

      <Button type="submit" className="mt-4 w-full">
        회원가입
      </Button>
    </>
  );
}
