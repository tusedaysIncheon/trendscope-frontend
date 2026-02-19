import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accessibility,
  ArrowRight,
  ChevronRight,
  Crown,
  Loader2,
  LogOut,
  Ruler,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useMyPageSummary } from "@/features/mypage/hooks/useMyPage";
import { useAuthStore } from "@/store/useAuthStore";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import type { AnalyzeJobListItem } from "@/types/trendscope";

const LOCALE_BY_LANGUAGE = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
} as const;

function getJobTitle(job: AnalyzeJobListItem, t: (key: string) => string) {
  return job.mode === "QUICK_1VIEW" ? t("mypage.quickMeasurement") : t("mypage.premiumMeasurement");
}

function getStatusLabel(status: AnalyzeJobListItem["status"], t: (key: string) => string) {
  switch (status) {
    case "QUEUED":
      return t("mypage.statusQueued");
    case "RUNNING":
      return t("mypage.statusRunning");
    case "COMPLETED":
      return t("mypage.statusCompleted");
    case "FAILED":
      return t("mypage.statusFailed");
    default:
      return status;
  }
}

function getStatusClass(status: AnalyzeJobListItem["status"]) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-50 text-green-700 border-green-200";
    case "FAILED":
      return "bg-red-50 text-red-700 border-red-200";
    case "RUNNING":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "QUEUED":
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export default function MyPagePage() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data, isLoading, isError, refetch, isFetching } = useMyPageSummary({
    ticketSize: 20,
    analyzeSize: 20,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const formatDate = (value: string | null) => {
    if (!value) return t("mypage.unknownDate");
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return t("mypage.unknownDate");
    return new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE[language], {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t("mypage.logoutSuccess"));
      navigate("/login", { replace: true });
    } catch {
      toast.error(t("mypage.logoutError"));
    }
  };

  return (
    <div className="font-['Inter',sans-serif] min-h-screen w-full bg-background">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background px-3 py-3 sm:px-5 sm:py-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex min-w-0 items-center gap-2 text-slate-900 transition-opacity hover:opacity-80"
        >
          <img src="/logo1.png" alt={t("common.appName")} className="h-8 w-8 rounded-sm object-contain sm:h-9 sm:w-9" />
          <span className="truncate text-base font-black tracking-tight sm:text-lg">{t("common.appName")}</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-3 text-[11px] font-bold text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-600 sm:h-9 sm:gap-2 sm:px-4 sm:text-xs"
        >
          <Ruler className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>{t("mypage.measureNow")}</span>
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-[480px] flex-1 justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-[480px] flex flex-col gap-6">
        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#EBF4FA]/70 p-5 transition-colors hover:bg-[#EBF4FA]">
              <div className="flex items-center gap-2 text-slate-600">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide">{t("mypage.quickTickets")}</span>
              </div>
              <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {isLoading ? "-" : data?.ticket.quickTicketBalance ?? 0}
              </p>
            </div>
            <div className="rounded-2xl bg-orange-50 p-5 transition-colors hover:bg-orange-100">
              <div className="flex items-center gap-2 text-slate-600">
                <Crown className="h-4 w-4 text-[#FA824C]" />
                <span className="text-xs font-semibold uppercase tracking-wide">{t("mypage.premiumTickets")}</span>
              </div>
              <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {isLoading ? "-" : data?.ticket.premiumTicketBalance ?? 0}
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <Button
              className="h-12 w-full rounded-full px-8 text-sm font-bold shadow-lg shadow-blue-200"
              onClick={() => navigate("/payment")}
            >
              {t("mypage.purchaseTickets")}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </Card>

        <div className="flex items-center justify-between px-1 pt-1">
          <h2 className="text-xl font-black tracking-tight text-slate-900">{t("mypage.measurementHistory")}</h2>
          <Button variant="ghost" className="h-auto p-0 text-sm font-medium text-primary hover:bg-transparent hover:text-blue-700">
            {t("mypage.viewAll")}
          </Button>
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

        {!isError && !isLoading && data && (
          <div className="flex flex-col gap-3">
            {data.recentAnalyzeJobs.length === 0 ? (
              <Card className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-500">
                {t("mypage.emptyHistory")}
              </Card>
            ) : (
              data.recentAnalyzeJobs.map((job) => {
                const isQuick = job.mode === "QUICK_1VIEW";
                const targetPath =
                  job.status === "COMPLETED"
                    ? `/measure/result/${job.jobId}`
                    : `/measure/analyzing/${job.jobId}`;
                return (
                  <article
                    key={job.jobId}
                    className="group flex cursor-pointer flex-col items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-center"
                    onClick={() => navigate(targetPath)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        {isQuick ? <Ruler className="h-5 w-5" /> : <Accessibility className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{getJobTitle(job, t)}</h3>
                        <p className="text-sm text-slate-500">{formatDate(job.createdDate)}</p>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(job.status)}`}
                      >
                        {getStatusLabel(job.status, t)}
                      </span>
                      <ChevronRight className="h-5 w-5 text-slate-300 transition-colors group-hover:text-primary" />
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}

        <div className="mt-2 mb-12 flex justify-center">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isFetching}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-red-100 bg-red-50 px-8 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogOut className="h-4 w-4" />
            <span>{t("mypage.logout")}</span>
          </button>
        </div>
      </div>
      </main>
    </div>
  );
}
