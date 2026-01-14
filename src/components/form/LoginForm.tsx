import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { SocialLoginSection } from "./SocialFromBottom";
import { useNavigate } from "react-router-dom";
import { getUserLoadInfo, loginAPI } from "@/lib/api/UserApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { queryClient } from "@/main";

// ★ 분리한 스키마와 타입 import
import { loginSchema, type LoginFormValues } from "@/lib/zodSchemas/LoginSchema";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema), // 외부 스키마 연결
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      
      const response = await loginAPI(data.username, data.password);
      const { accessToken } = response;
      
      if(!accessToken){
        throw new Error("엑세스 토큰을 받아오지 못했습니다.")
      }

      setAccessToken(accessToken);

     const fullUserInfo = await getUserLoadInfo();
      
      queryClient.setQueryData(['user'], fullUserInfo);

    const displayName = fullUserInfo.nickname || data.username;
      
      toast.success(`${displayName}님 환영합니다! 🎉`);

      // (선택사항) 프로필 설정이 필요한 경우 분기 처리
      if (fullUserInfo.needsProfileSetup) {
         navigate("/profile-setup", { replace: true });
      } else {
         navigate("/", { replace: true });
      }

    } catch (error) {
      // 에러 처리 (기존 로직 유지)
      if (error instanceof AxiosError && error.response?.data) {
        const serverMessage = error.response.data.message;
        toast.error(serverMessage || "로그인에 실패했습니다.");
      } else {
        console.error("Login Error:", error);
        toast.error("서버와 통신 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a href="/">
              <img
                src={logo}
                alt="The WDUW Logo"
                className="h-[11.25rem] w-auto select-none"
              />
              <span className="sr-only">Vote Inc.</span>
            </a>
            <FieldDescription className="pt-12">
              계정이 없으십니까?{" "}
              <a href="/signup" className="text-primary hover:underline">
                회원가입
              </a>
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="username">아이디</FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="아이디를 입력하세요"
              {...register("username")}
              className={cn(
                errors.username && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">비밀번호</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...register("password")}
              className={cn(
                errors.password && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </Field>

          <Field>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 active:scale-95 active:brightness-90 transition-transform duration-100"
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </Field>

          <SocialLoginSection />
        </FieldGroup>
      </form>
      <FieldDescription className="flex flex-col px-6 text-center text-sm text-muted-foreground">
        본격 결정장애 해결 SNS,{" "}
        <span className="font-medium text-foreground pt-1">WDUW✨</span>
      </FieldDescription>
    </div>
  );
}