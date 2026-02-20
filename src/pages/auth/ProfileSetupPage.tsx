import { PageLayout } from "@/shared/layouts/PageLayout";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { UserRound, Sparkles, Camera } from "lucide-react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import {
  GENDER_LIST,
  REGION_LIST,
  RELATIONSHIP_LIST,
  MBTI_LIST,
  type UserDetailRequestDTO,
} from "@/types/profile";

// API 함수들 (UserApi.ts 경로 확인 필요)


import { saveUserDetails } from "@/features/user/api/user.api";
import { getPresignedUrlAPI, uploadToS3 } from "@/shared/api/file.api";
import { queryClient } from "@/main";
import { getApiErrorMessage } from "@/lib/api/error";

// --- 1. Zod 스키마 정의 ---
const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 2자 이상이어야 합니다.")
    .max(20, "닉네임은 20자 이하로 입력해주세요.")
    .regex(/^[가-힣a-zA-Z0-9._-]+$/, "특수문자는 ._- 만 가능합니다"),

  // 🔥 [수정] 날짜 객체 대신 "연도 문자열"을 받습니다.
  birthYear: z.string().min(1, "태어난 연도를 선택해주세요."),

  gender: z.string().min(1, "성별을 선택해주세요"),
  region: z.string().min(1, "거주 지역을 선택해주세요"),
  relationshipStatus: z.string().min(1, "연애 상태를 선택해주세요"),
  mbti: z.string().optional(),
  introduce: z.string().max(100, "100자 이내로 작성해주세요").optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileSetupPage() {
  const navigate = useNavigate();

  // ✅ 이미지 업로드용 State & Ref
  const [preview, setPreview] = useState<string | null>(null);
  const [s3FileKey, setS3FileKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Form 설정
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: "",
      birthYear: "", // 초기값은 빈 문자열
      gender: "",
      region: "",
      relationshipStatus: "",
      mbti: "",
      introduce: "",
    },
    mode: "onChange",
  });

  // 중복 제출 방지용 상태
  const { isSubmitting } = form.formState;

  // ✅ 이미지 변경 핸들러 (S3 업로드 로직)
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. 미리보기 URL 생성 (즉시 보여주기)
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      try {
        toast.info("이미지 업로드를 시작합니다... ☁️");

        // 2. Presigned URL 발급 요청 (백엔드)
        // 폴더명: profileImage, contestImage 등 백엔드 규칙에 맞게
        const { presignedUrl, fileKey } = await getPresignedUrlAPI(
          file.name,
          "profileImage"
        );

        // 3. AWS S3 직접 업로드 (토큰 없이)
        await uploadToS3(presignedUrl, file);

        // 4. 성공 시 키 저장
        setS3FileKey(fileKey);
        toast.success("프로필 사진 업로드 완료 👌");
      } catch (error) {
        console.error("이미지 업로드 실패", error);
        toast.error("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        setS3FileKey(null); // 실패 시 초기화
      }
    }
  };

  // ✅ 폼 제출 핸들러
  const onSubmit = async (data: ProfileForm) => {
    try {
      // DTO 변환 작업
      const submitData: UserDetailRequestDTO = {
        nickname: data.nickname,

        // 🔥 [핵심] 문자열("1994") -> 숫자(1994)로 변환
        birthYear: data.birthYear,

        gender: data.gender as UserDetailRequestDTO["gender"],

        // 백엔드 Enum을 한글로 바꿨으므로 그대로 전송 (영어면 매핑 필요)
        region: data.region as UserDetailRequestDTO["region"],

        relationshipStatus:
          data.relationshipStatus as UserDetailRequestDTO["relationshipStatus"],
        mbti: (data.mbti as UserDetailRequestDTO["mbti"]) || undefined,
        introduce: data.introduce || undefined,

        // S3 파일 키 추가
        imageUrl: s3FileKey || undefined,
      };

      console.log("🚀 전송 데이터:", submitData);

      // 회원 정보 저장 API 호출
      await saveUserDetails(submitData);

      queryClient.invalidateQueries({ queryKey: ['user'] });

      toast.success("프로필 설정 완료! 🎉");
      navigate("/", { replace: true }); // 메인으로 이동
    } catch (error: unknown) {
      console.error(error);
      toast.error(getApiErrorMessage(error, "저장에 실패했습니다 😢"));
    }
  };

  return (
    <PageLayout
      variant="centered"
      contentWidth="md"
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <Card className="w-full max-w-lg mx-auto shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2 pb-8">
          <CardTitle className="text-2xl font-bold">
            내 프로필 완성하기
          </CardTitle>
          <CardDescription className="text-base">
            투표 통계를 위해 <b>딱 30초</b>만 투자해주세요.
            <br />
            솔직하게 적어야 결정 장애 해결에 도움이 됩니다!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 📸 프로필 이미지 업로더 */}
              <div className="flex flex-col items-center justify-center mb-2">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => !isSubmitting && fileInputRef.current?.click()}
                >
                  <Avatar className="w-28 h-28 border-4 border-muted shadow-sm group-hover:border-primary transition-all">
                    <AvatarImage src={preview || ""} className="object-cover" />
                    <AvatarFallback className="bg-muted">
                      <UserRound className="w-12 h-12 text-muted-foreground/50" />
                    </AvatarFallback>
                  </Avatar>

                  {/* 카메라 아이콘 배지 */}
                  <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-md group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting} // 저장 중엔 변경 불가
                />
                <p className="text-xs text-muted-foreground mt-3">
                  프로필 사진을 눌러 변경하세요
                </p>
              </div>

              {/* 1. 닉네임 */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">닉네임</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="센스있는 닉네임 (2~20자)"
                          className="h-11 text-md bg-muted/30 focus:bg-background transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 2. 인적사항 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 🔥 [수정됨] 생년월일 -> 태어난 연도 (Select) */}
                <FormField
                  control={form.control}
                  name="birthYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        태어난 연도 <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 hover:bg-muted/50">
                            <SelectValue placeholder="선택해주세요" />
                          </SelectTrigger>
                        </FormControl>
                        {/* 높이 제한(max-h-[300px])으로 스크롤 버그 해결 */}
                        <SelectContent className="max-h-[300px]">
                          {Array.from(
                            { length: new Date().getFullYear() - 1950 + 1 },
                            (_, i) => (new Date().getFullYear() - i).toString()
                          ).map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}년
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 성별 */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        성별 <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 hover:bg-muted/50">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENDER_LIST.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g === "MALE" ? "남성 🙋‍♂️" : "여성 🙋‍♀️"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 3. 추가 정보 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 거주지 */}
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        거주지 <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 hover:bg-muted/50">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {REGION_LIST.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 연애 상태 */}
                <FormField
                  control={form.control}
                  name="relationshipStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        연애 상태 <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 hover:bg-muted/50">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RELATIONSHIP_LIST.map((rs) => (
                            <SelectItem key={rs} value={rs}>
                              {rs === "SINGLE"
                                ? "솔로 🥲"
                                : rs === "IN_RELATIONSHIP"
                                  ? "연애중 🥰"
                                  : "결혼함 💍"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* MBTI */}
              <FormField
                control={form.control}
                name="mbti"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      MBTI{" "}
                      <span className="text-xs text-muted-foreground font-normal">
                        (선택)
                      </span>
                    </FormLabel>
                    <Select
                      onValueChange={(val) =>
                        field.onChange(val === "NONE" ? "" : val)
                      }
                      value={field.value || "NONE"}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 hover:bg-muted/50">
                          <SelectValue placeholder="당신의 MBTI는?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem
                          value="NONE"
                          className="text-muted-foreground"
                        >
                          선택 안 함
                        </SelectItem>
                        {MBTI_LIST.filter((m) => m !== "").map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 한줄 소개 */}
              <FormField
                control={form.control}
                name="introduce"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      한줄 소개{" "}
                      <span className="text-xs text-muted-foreground font-normal">
                        (선택)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="나를 표현하는 한 마디 (최대 100자)"
                        className="bg-muted/30 focus:bg-background"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting} // 저장 중 버튼 클릭 방지
                  className="w-full h-12 text-lg font-bold shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span> 저장 중...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 fill-white" />
                      TrendScope 시작하기 🚀
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
