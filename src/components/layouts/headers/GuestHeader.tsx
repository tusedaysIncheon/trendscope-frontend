import logo from "@/assets/logo.png"
import { ModeToggle } from "@/components/theme/mod-toggle"
import { Button } from "@/components/ui/button"

export function GuestHeader() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white dark:bg-[#09090b] ">
      <div className="flex h-[60px] items-center justify-between px-4 max-w-screen-xl mx-auto w-full">
        <a href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <img src={logo} alt="The WDUW Logo" className="h-8 w-auto select-none" />
        </a>
        
        {/* 우측 로그인/다크모드 */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary font-medium"
          >
            <a href="/login">로그인</a>
          </Button>
          
          <Button
            asChild
            size="sm"
            className="px-4 font-bold shadow-sm"
          >
            <a href="/signup">회원가입</a>
          </Button>

          <div className="ml-1">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}