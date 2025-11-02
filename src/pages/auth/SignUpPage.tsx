import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SocialLoginSection } from "@/components/layout/SocialLoginSection";
import { Input } from "@/components/ui/input";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import { signUpApi } from "@/lib/api/UserApi";
import type { UserRequestDTO } from "@/types/user";
import { toast } from "sonner";

export default function SignUpPage() {
  const form = useSignUpForm();

  const onSubmit = async (data: UserRequestDTO) => {
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
  };

  return (
    <section className="flex flex-col items-center justify-start h-screen bg-background text-foreground p-8">
      {/* 상단 타이틀 */}
      <h1 className="text-5xl font-bold">Vote</h1>
      <p className="pt-6 text-muted-foreground">
        회원가입하고 Vote 서비스를 이용해보세요
      </p>
     
      <SocialLoginSection />

      {/* 회원가입 폼 */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full max-w-sm gap-4"
          noValidate
        >
          {/* 아이디 */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>아이디</FormLabel>
                <FormControl>
                  <Input placeholder="아이디를 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 닉네임 */}
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>닉네임</FormLabel>
                <FormControl>
                  <Input placeholder="닉네임을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 이메일 */}
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

          {/* 비밀번호 */}
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

          {/* 비밀번호 확인 */}
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

          {/* 제출 버튼 */}
          <Button type="submit" className="w-full mt-2 active:scale-95 active:brightness-90 transition-transform duration-100">
            회원가입
          </Button>
        </form>
      </Form>
    </section>
  );
}
