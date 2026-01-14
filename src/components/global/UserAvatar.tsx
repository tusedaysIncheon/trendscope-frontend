import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";

const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;

interface UserAvatarProps {
  className?: string;
}

export function UserAvatar({ className }: UserAvatarProps) {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <Skeleton className={cn("h-10 w-10 rounded-full", className)} />;
  }

  const fullUrl = user?.imageUrl
    ? `${CDN_BASE_URL}/${user.imageUrl}`
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
          alt={user?.nickname ?? "User"}
          className="object-cover"
        />
      )}
      <AvatarFallback className="bg-muted text-xs font-medium">
        {user?.nickname?.[0]?.toUpperCase() ?? "U"}
      </AvatarFallback>
    </Avatar>
  );
}