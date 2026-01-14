import logo from "@/assets/logo.png"
import { SocialLoginSection } from "@/components/form/SocialSignForm";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRegiForm } from "@/hooks/useRegiForm";
import { useSignUpForm } from "@/hooks/useSignUpForm";

export default function SignUpPage() {
  const form = useSignUpForm();
  const { onSubmit, handleBlurUsername } = useRegiForm(form);

  return (
    <PageLayout
      variant="centered"
      contentWidth="sm"
      contentClassName="items-center text-center"
      className="md:py-16"
    >
      <a href="/">
        <img src={logo} alt="The WDUW Logo" className="h-45 w-auto select-none" />
      </a>
      <p className="text-muted-foreground">
        회원가입하고 WDUW✨를 이용해보세요
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
            className="w-full mt-2 active:scale-95 active:brightness-90 transition-transform duration-100"
          >
            회원가입
          </Button>
        </form>
      </Form>
    </PageLayout>
  );
}
