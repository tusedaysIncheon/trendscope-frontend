import { ModeToggle } from "@/shared/theme/mod-toggle"
import { Button } from "@/shared/ui/button"
import { useI18n } from "@/lib/i18n/I18nProvider"
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher"

export function GuestHeader() {
  const { t } = useI18n()

  return (
    <header className="fixed top-0 z-50 w-full bg-white">
      <div className="flex h-[60px] items-center justify-between px-4 max-w-screen-xl mx-auto w-full">
        <a
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <img
            src="/logo1.png"
            alt={t("common.appName")}
            className="h-8 w-8 rounded-sm object-contain select-none"
          />
          <span className="text-base font-black tracking-tight text-foreground">{t("common.appName")}</span>
        </a>

        {/* 우측 로그인/다크모드 */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary font-medium"
          >
            <a href="/login">{t("common.login")}</a>
          </Button>

          <Button
            asChild
            variant="secondary"
            size="sm"
            className="px-4 font-bold shadow-sm"
          >
            <a href="/login">{t("common.socialLogin")}</a>
          </Button>

          <div className="ml-1">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
