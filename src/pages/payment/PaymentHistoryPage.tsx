import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Loader2, ReceiptText, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useTicketSummary } from "@/features/tickets/hooks/useTicket";
import { useAuthStore } from "@/store/useAuthStore";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { SEO } from "@/shared/components/SEO";

const LOCALE_BY_LANGUAGE = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
} as const;

export default function PaymentHistoryPage() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data, isLoading, isError, refetch } = useTicketSummary(100);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const purchaseItems = useMemo(
    () => (data?.recentLedger ?? []).filter((item) => item.reason === "PURCHASE"),
    [data?.recentLedger]
  );

  const formatDate = (value: string | null) => {
    if (!value) return t("mypage.unknownDate");
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return t("mypage.unknownDate");
    return new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE[language], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="font-['Inter',sans-serif] min-h-screen w-full bg-background">
      <SEO title={`${t("mypage.paymentHistoryTitle")} - TrendScope`} noindex={true} />

      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900"
        >
          {t("common.back")}
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-[720px] flex-1 justify-center px-4 py-8 sm:px-6">
        <div className="w-full space-y-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{t("mypage.paymentHistoryTitle")}</h1>
            <p className="text-sm text-slate-500">{t("mypage.paymentHistorySubtitle")}</p>
          </div>

          {isError && (
            <Card className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <p>{t("mypage.loadError")}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-red-200 bg-white text-red-700 hover:bg-red-100"
                onClick={() => refetch()}
              >
                {t("mypage.retry")}
              </Button>
            </Card>
          )}

          {!isError && isLoading && (
            <Card className="flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t("mypage.loading")}</span>
            </Card>
          )}

          {!isError && !isLoading && (
            <>
              {purchaseItems.length === 0 ? (
                <Card className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-500">
                  {t("mypage.paymentHistoryEmpty")}
                </Card>
              ) : (
                <div className="flex flex-col gap-3">
                  {purchaseItems.map((item) => {
                    const isQuick = item.ticketType === "QUICK";
                    return (
                      <article
                        key={item.id}
                        className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary">
                              {isQuick ? <Zap className="h-4 w-4" /> : <Crown className="h-4 w-4 text-[#FA824C]" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {isQuick ? t("common.quickTicket") : t("common.premiumTicket")}
                              </p>
                              <p className="text-xs text-slate-500">{formatDate(item.createdDate)}</p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            <ReceiptText className="h-3.5 w-3.5" />
                            {t("mypage.paymentHistoryCount")}: {Math.abs(item.delta)}
                          </span>
                        </div>
                        <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                          <span className="font-semibold">{t("mypage.paymentHistoryOrderId")}:</span>{" "}
                          <span className="font-mono">{item.refId}</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
