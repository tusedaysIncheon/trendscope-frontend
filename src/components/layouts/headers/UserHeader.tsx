import logo from "@/assets/logo.png";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/global/UserAvatar";

export function UserHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-[60px] items-center justify-between px-4 max-w-screen-xl mx-auto w-full">
        <a
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <img
            src={logo}
            alt="The WDUW Logo"
            className="h-8 w-auto select-none"
          />
        </a>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">알림</span>
          </Button>

          <UserAvatar className="h-9 w-9" />
        </div>
      </div>
    </header>
  );
}