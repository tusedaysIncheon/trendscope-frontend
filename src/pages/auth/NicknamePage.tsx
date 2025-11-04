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
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

// ✅ 닉네임 유효성 검증
const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 2자 이상이어야 합니다.")
    .max(10, "닉네임은 10자 이하로 입력해주세요.")
    .regex(/^[가-힣a-zA-Z0-9._-]+$/, "한글/영문/숫자/._-만 사용할 수 있습니다."),
});

type NicknameForm = z.infer<typeof nicknameSchema>;

export default function NicknamePage() {
  const navigate = useNavigate();

  const form = useForm<NicknameForm>({
    resolver: zodResolver(nicknameSchema),
    defaultValues: { nickname: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: NicknameForm) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("로그인 정보가 없습니다.");

      const response = await fetch(`${BACKEND_API_BASE_URL}/v1/user/nickname`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "닉네임 등록 실패");
      }

      toast.success("닉네임이 등록되었습니다 🎉");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "닉네임 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="flex flex-col items-center justify-start h-screen bg-background text-foreground p-8">
      {/* 상단 타이틀 */}
      <h1 className="text-3xl font-bold pt-40">센스있는 닉네임 짓기😂</h1>
      <p className="pt-3 text-muted-foreground">
        처음 로그인하셨군요!
      </p>
      <p className="pt-3 text-muted-foreground">
      사용할 닉네임을 입력해주세요.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full max-w-sm gap-4 mt-8"
          noValidate
        >
          {/* 닉네임 입력 */}
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

          {/* 제출 버튼 */}
          <Button
            type="submit"
            className="w-full mt-2 active:scale-95 active:brightness-90 transition-transform duration-100"
          >
            등록하기
          </Button>
        </form>
      </Form>
    </section>
  );
}
