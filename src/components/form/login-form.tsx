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
import { useState } from "react";
import { toast } from "sonner";
import { SocialLoginSection } from "./SocialFromBottom";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuthStore();

  const loginSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(username, password);
      toast.success("로그인 성공 🎉");
    } catch (error) {
      toast.error("아이디 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={loginSubmitHandler}>
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
              계정이 없으십니까? <a href="/signup">회원가입</a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="username">아이디</FieldLabel>
            <Input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">비밀번호</FieldLabel>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field>
            <Button
              type="submit"
              className="w-full mt-2 active:scale-95 active:brightness-90 transition-transform duration-100"
            >
              로그인
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
