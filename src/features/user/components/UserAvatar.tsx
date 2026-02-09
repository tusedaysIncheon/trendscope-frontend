import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { cn } from "@/lib/utils";
import { useUser } from "@/features/user/hooks/useUser";
import { Skeleton } from "@/shared/ui/skeleton";

const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;

interface UserAvatarProps {
  className?: string;
  imageUrl?: string | null;
  nickname?: string;
}

export function UserAvatar({ className, imageUrl: propImageUrl, nickname: propNickname }: UserAvatarProps) {
  const { data: user } = useUser();

  // Props로 전달된 값이 있으면 그것을 사용 (타인의 프로필)
  // 없으면 내 정보 사용 (내 프로필)
  const imageUrl = propImageUrl ?? user?.imageUrl;
  const nickname = propNickname ?? user?.nickname;

  const fullUrl = imageUrl
    ? `${CDN_BASE_URL}/${imageUrl}`
    : undefined;

  return (
    <Avatar
      className={cn(
        "border cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all",
        className
      )}
    >
      {fullUrl && (
        <AvatarImage
          src={fullUrl}
          alt={nickname ?? "User"}
          className="object-cover"
        />
      )}
      <AvatarFallback className="bg-muted text-xs font-medium">
        {nickname?.[0]?.toUpperCase() ?? "U"}
      </AvatarFallback>
    </Avatar>
  );
}