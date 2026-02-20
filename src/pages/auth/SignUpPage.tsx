import { SocialLoginSection } from "@/features/auth/components/SocialSignForm";
import { PageLayout } from "@/shared/layouts/PageLayout";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { useRegiForm } from "@/features/auth/hooks/useRegiForm";
import { useSignUpForm } from "@/features/auth/hooks/useSignUpForm";

export default function SignUpPage() {
  const form = useSignUpForm();
  const { onSubmit, handleBlurUsername, isUsernameAvailable } = useRegiForm(form);
  const { isValid, isSubmitting } = form.formState;

  return (
    <PageLayout
      variant="centered"
      contentWidth="sm"
      contentClassName="items-center text-center"
    >
      <a href="/">
        <img src="/logo1.png" alt="TrendScope Logo" className="h-45 w-auto select-none" />
      </a>
      <p className="text-muted-foreground">
        회원가입하고 TrendScope를 시작해보세요
      </p>

      <SocialLoginSection />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full max-w-sm gap-4 text-left"
          noValidate
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>아이디</FormLabel>
                <FormControl>
                  <Input
                    placeholder="아이디를 입력하세요"
                    {...field}
                    onBlur={(e) => {
                      handleBlurUsername(e.target.value);
                    }}
                  />
                </FormControl>
                {isUsernameAvailable && !form.formState.errors.username && (
                  <p className="text-sm font-medium text-blue-500">
                    사용 가능한 아이디입니다! 🎉
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="8자 이상 입력해주세요"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="비밀번호를 다시 입력"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={!isValid || isSubmitting || isUsernameAvailable === false}
            className="w-full mt-2 active:scale-95 active:brightness-90 transition-transform duration-100"
          >
            {isSubmitting ? "가입 중..." : "회원가입"}
          </Button>
        </form>
      </Form>
    </PageLayout>
  );
}
