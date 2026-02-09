import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Image as ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { PageLayout } from "@/shared/layouts/PageLayout";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";

import { createVoteApi } from "@/features/vote/api/vote.api";
import { getPresignedUrlAPI, uploadToS3 } from "@/shared/api/file.api";
import type { VoteRequest } from "@/types/vote";

const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;

export default function CreateVotePage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // 로컬 미리보기 URL 상태 관리
    const [previews, setPreviews] = useState<{ [key: string]: string }>({});

    const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm<VoteRequest>({
        defaultValues: {
            content: "",
            imageUrl: "",
            duration: 24, // 기본 24시간
            options: [
                { content: "", imageUrl: "" },
                { content: "", imageUrl: "" },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "options",
    });

    useEffect(() => {
        return () => {
            Object.values(previews).forEach(url => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const getFullImageUrl = (s3Key: string, previewKey: string) => {
        if (previews[previewKey]) return previews[previewKey];
        if (!s3Key) return "";
        if (s3Key.startsWith("http")) return s3Key;
        return `${CDN_BASE_URL}/${s3Key}`;
    };

    const handleImageUpload = async (file: File, folder: "votepic" | "options") => {
        try {
            setIsUploading(true);
            const { presignedUrl, fileKey } = await getPresignedUrlAPI(file.name, folder);
            await uploadToS3(presignedUrl, file);
            return fileKey;
        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("이미지 업로드에 실패했습니다.");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const onMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setPreviews(prev => ({ ...prev, "main": previewUrl }));

        const s3Key = await handleImageUpload(file, "votepic");
        if (s3Key) {
            setValue("imageUrl", s3Key);
        }
    };

    const onOptionImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setPreviews(prev => ({ ...prev, [`option-${index}`]: previewUrl }));

        const s3Key = await handleImageUpload(file, "options");
        if (s3Key) {
            setValue(`options.${index}.imageUrl` as const, s3Key);
        }
    };

    const onRemoveMainImage = () => {
        setValue("imageUrl", "");
        setPreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews["main"];
            return newPreviews;
        });
    };

    const onRemoveOptionImage = (index: number) => {
        setValue(`options.${index}.imageUrl` as const, "");
        setPreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[`option-${index}`];
            return newPreviews;
        });
    }

    const onSubmit = async (data: VoteRequest) => {
        if (data.options.length < 2) {
            toast.error("최소 2개의 투표 항목이 필요합니다.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createVoteApi(data);
            toast.success("투표가 성공적으로 생성되었습니다!");
            navigate("/"); // 메인으로 이동
        } catch (error) {
            console.error(error);
            toast.error("투표 생성에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageLayout variant="top" contentWidth="sm" className="py-6">
            <Card className="border-none shadow-none sm:border sm:shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">새 투표 만들기</CardTitle>
                    <CardDescription>
                        사람들에게 물어보고 싶은 내용을 자유롭게 작성해보세요.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* 질문 내용 */}
                        <div className="space-y-2">
                            <Label htmlFor="content">질문 내용</Label>
                            <textarea
                                id="content"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="예) 이번 주말 여행 어디로 갈까요?"
                                {...register("content", { required: "질문 내용을 입력해주세요." })}
                            />
                            {errors.content && (
                                <p className="text-xs text-red-500 font-medium">{errors.content.message}</p>
                            )}
                        </div>

                        {/* 대표 이미지 (S3 Upload) */}
                        <div className="space-y-2">
                            <Label>대표 이미지 (선택)</Label>
                            {!watch("imageUrl") && !previews["main"] ? (
                                <div>
                                    <Input
                                        id="main-image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={onMainImageChange}
                                        disabled={isUploading}
                                    />
                                    <Label
                                        htmlFor="main-image-upload"
                                        className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <ImageIcon className="w-8 h-8" />
                                            <span className="text-sm">클릭하여 이미지 업로드</span>
                                        </div>
                                    </Label>
                                </div>
                            ) : (
                                <div className="relative mt-2 rounded-md overflow-hidden border w-full bg-muted/20">
                                    <img
                                        src={getFullImageUrl(watch("imageUrl") || "", "main")}
                                        alt="Main Preview"
                                        className="w-full h-auto max-h-[300px] object-contain"
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground"
                                        onClick={onRemoveMainImage}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}
                            <input type="hidden" {...register("imageUrl")} />
                        </div>

                        {/* 투표 항목 */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>투표 항목</Label>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="space-y-2 animate-in slide-in-from-left-2 duration-300">
                                        <div className="flex gap-2 items-center">
                                            <div className="flex-1">
                                                <Input
                                                    placeholder={`항목 ${index + 1}`}
                                                    {...register(`options.${index}.content` as const, { required: "항목 내용을 입력해주세요." })}
                                                />
                                            </div>

                                            {/* 이미지 업로드 버튼 (아이콘) */}
                                            <Input
                                                id={`option-upload-${index}`}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => onOptionImageChange(index, e)}
                                                disabled={isUploading}
                                            />
                                            <Label
                                                htmlFor={`option-upload-${index}`}
                                                className={`p-2 rounded-md border cursor-pointer hover:bg-accent transition-colors ${(watch(`options.${index}.imageUrl` as const) || previews[`option-${index}`])
                                                    ? 'bg-accent text-accent-foreground border-primary'
                                                    : 'bg-background text-muted-foreground'
                                                    }`}
                                            >
                                                <ImageIcon className="w-5 h-5" />
                                            </Label>

                                            {/* 삭제 버튼 */}
                                            {fields.length > 2 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            )}
                                        </div>

                                        {/* 이미지 미리보기 (입력창 아래) */}
                                        {(watch(`options.${index}.imageUrl` as const) || previews[`option-${index}`]) && (
                                            <div className="relative inline-block mt-1">
                                                <div className="rounded-md border overflow-hidden">
                                                    <img
                                                        src={getFullImageUrl(watch(`options.${index}.imageUrl` as const) || "", `option-${index}`)}
                                                        alt="Option Preview"
                                                        className="w-auto h-32 object-cover"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full shadow-sm bg-muted text-muted-foreground hover:bg-muted/80"
                                                    onClick={() => onRemoveOptionImage(index)}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                                <input type="hidden" {...register(`options.${index}.imageUrl` as const)} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full mt-2"
                                onClick={() => append({ content: "", imageUrl: "" })}
                                disabled={fields.length >= 10}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                항목 추가하기
                            </Button>
                            {errors.options && (
                                <p className="text-xs text-red-500 font-medium">최소 2개의 항목을 입력해주세요.</p>
                            )}
                        </div>

                        {/* 기간 설정 */}
                        <div className="space-y-2">
                            <Label htmlFor="duration">투표 기간</Label>
                            <Select
                                onValueChange={(value) => setValue("duration", parseInt(value))}
                                defaultValue="24"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="기간 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1시간</SelectItem>
                                    <SelectItem value="6">6시간</SelectItem>
                                    <SelectItem value="12">12시간</SelectItem>
                                    <SelectItem value="24">24시간 (1일)</SelectItem>
                                    <SelectItem value="48">48시간 (2일)</SelectItem>
                                    <SelectItem value="72">72시간 (3일)</SelectItem>
                                    <SelectItem value="168">1주일</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting || isUploading}>
                                {isSubmitting || isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {isUploading ? "이미지 업로드 중..." : "투표 생성 중..."}
                                    </>
                                ) : (
                                    "투표 시작하기"
                                )}
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </PageLayout>
    );
}
