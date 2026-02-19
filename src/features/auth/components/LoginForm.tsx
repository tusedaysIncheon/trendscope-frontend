import logo from "@/assets/logo.png";
import { Button } from "@/shared/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { SocialLoginSection } from "./SocialFromBottom";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "@/features/auth/api/auth.api";
import { getUserLoadInfo } from "@/features/user/api/user.api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { queryClient } from "@/main";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";

// ★ 분리한 스키마와 타입 import
import { loginSchema, type LoginFormValues } from "@/lib/zodSchemas/LoginSchema";

const PASSWORD_LOGIN_ENABLED = false;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { t } = useI18n();
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
    if (!PASSWORD_LOGIN_ENABLED) {
      toast.error(t("login.toastDisabled"));
      return;
    }

    try {

      const response = await loginAPI(data.username, data.password);
      const { accessToken } = response;

      if (!accessToken) {
        throw new Error(t("login.toastTokenMissing"))
      }

      setAccessToken(accessToken);

      const fullUserInfo = await getUserLoadInfo();

      queryClient.setQueryData(['user'], fullUserInfo);

      const displayName = fullUserInfo.nickname || data.username;

      toast.success(t("login.toastWelcome", { name: displayName }));

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
        toast.error(serverMessage || t("login.toastLoginFailed"));
      } else {
        console.error("Login Error:", error);
        toast.error(t("login.toastNetworkError"));
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <a href="/">
              <img
                src={logo}
                alt="The WDUW Logo"
                className="h-[11.25rem] w-auto select-none"
              />
              <span className="sr-only">{t("common.appName")}</span>
            </a>
            <FieldDescription className="pt-12">
              {t("login.socialOnlyDescription")}
            </FieldDescription>
            {!PASSWORD_LOGIN_ENABLED && (
              <p className="text-xs text-muted-foreground">
                {t("login.passwordDisabled")}
              </p>
            )}
          </div>

          <Field>
            <FieldLabel htmlFor="username">{t("login.usernameLabel")}</FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder={t("login.usernamePlaceholder")}
              disabled={!PASSWORD_LOGIN_ENABLED}
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
            <FieldLabel htmlFor="password">{t("login.passwordLabel")}</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder={t("login.passwordPlaceholder")}
              disabled={!PASSWORD_LOGIN_ENABLED}
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
              disabled={isSubmitting || !PASSWORD_LOGIN_ENABLED}
              className="w-full mt-2 active:scale-95 active:brightness-90 transition-transform duration-100"
            >
              {PASSWORD_LOGIN_ENABLED
                ? isSubmitting
                  ? t("login.submitting")
                  : t("login.submit")
                : t("login.socialOnlyButton")}
            </Button>
          </Field>

          <SocialLoginSection />
        </FieldGroup>
      </form>
      <FieldDescription className="flex flex-col px-6 text-center text-sm text-muted-foreground">
        {t("login.brandLineTop")}{" "}
        <span className="font-medium text-foreground pt-1">{t("login.brandLineBottom")}</span>
      </FieldDescription>
    </div>
  );
}
