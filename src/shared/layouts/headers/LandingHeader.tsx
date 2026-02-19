import { Link, useNavigate } from "react-router-dom";
import { Crown, Zap } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useAuthStore } from "@/store/useAuthStore";
import { useTicketSummary } from "@/features/tickets/hooks/useTicket";

type LandingHeaderProps = {
  showCta?: boolean;
  ctaPath?: string;
  ctaLabelKey?: string;
  enableTicketRouting?: boolean;
};

export function LandingHeader({
  showCta = true,
  ctaPath = "/login",
  ctaLabelKey = "common.start",
  enableTicketRouting = false,
}: LandingHeaderProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: ticketSummary, isLoading } = useTicketSummary();
  const showTicketBadges = showCta && isAuthenticated && ctaLabelKey === "common.myPage";
  const quickBalanceNumber = ticketSummary?.quickTicketBalance ?? 0;
  const premiumBalanceNumber = ticketSummary?.premiumTicketBalance ?? 0;
  const quickBalance = isLoading ? "-" : String(ticketSummary?.quickTicketBalance ?? 0);
  const premiumBalance = isLoading ? "-" : String(ticketSummary?.premiumTicketBalance ?? 0);

  const goToTicketAction = (ticketType: "QUICK" | "PREMIUM") => {
    if (!enableTicketRouting || isLoading) return;

    const balance = ticketType === "QUICK" ? quickBalanceNumber : premiumBalanceNumber;
    if (balance <= 0) {
      navigate("/payment");
      return;
    }

    navigate("/measure/info", {
      state: {
        measurementModel: ticketType === "QUICK" ? "quick" : "premium",
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background px-3 py-3 sm:px-5 sm:py-4">
      <Link to="/" className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-80">
        <img src="/logo1.png" alt={t("common.appName")} className="h-8 w-8 rounded-sm object-contain sm:h-9 sm:w-9" />
        <span className="truncate text-base font-black tracking-tight sm:text-lg">{t("common.appName")}</span>
      </Link>

      <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
        {showTicketBadges && (
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-1 py-0.5 sm:px-1.5 sm:py-1">
            <button
              type="button"
              onClick={() => goToTicketAction("QUICK")}
              disabled={isLoading}
              className="inline-flex items-center gap-1 rounded-full bg-transparent px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 sm:px-2 sm:py-0.5 sm:text-[11px]"
              aria-label={`${t("common.quickTicket")} ${quickBalance}`}
            >
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">{t("common.quickTicket")}</span>
              <span className="font-bold text-slate-900">{quickBalance}</span>
            </button>

            <span className="px-0.5 text-[10px] font-semibold text-slate-300 sm:px-1 sm:text-[11px]">|</span>

            <button
              type="button"
              onClick={() => goToTicketAction("PREMIUM")}
              disabled={isLoading}
              className="inline-flex items-center gap-1 rounded-full bg-transparent px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 sm:px-2 sm:py-0.5 sm:text-[11px]"
              aria-label={`${t("common.premiumTicket")} ${premiumBalance}`}
            >
              <Crown className="h-3.5 w-3.5 text-[#FA824C]" />
              <span className="hidden sm:inline">{t("common.premiumTicket")}</span>
              <span className="font-bold text-slate-900">{premiumBalance}</span>
            </button>
          </div>
        )}
        <LanguageSwitcher />
        {showCta && (
          <Button
            variant="secondary"
            size="sm"
            className="h-8 whitespace-nowrap rounded-full px-3 text-[11px] font-bold sm:h-9 sm:px-4 sm:text-xs"
            asChild
          >
            <Link to={ctaPath}>
              <span className="inline-block translate-y-[0.5px]">{t(ctaLabelKey)}</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
