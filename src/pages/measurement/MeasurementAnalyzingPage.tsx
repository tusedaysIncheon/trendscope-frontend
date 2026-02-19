import { AlertTriangle, ArrowLeft, Check, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAnalyzeJob } from "@/features/analyze/hooks/useAnalyze";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Card } from "@/shared/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import type { AnalyzeJobStatus, MeasurementModel } from "@/types/trendscope";

const CIRCLE_CIRCUMFERENCE = 283;

type StepState = "done" | "active" | "pending" | "failed";

function getCircleProgress(status: AnalyzeJobStatus | undefined) {
  switch (status) {
    case "QUEUED":
      return 45;
    case "RUNNING":
      return 63;
    case "COMPLETED":
      return 100;
    case "FAILED":
      return 100;
    default:
      return 35;
  }
}

function getHeaderProgress(status: AnalyzeJobStatus | undefined) {
  if (status === "COMPLETED" || status === "FAILED") {
    return 100;
  }
  return 90;
}

function getStepStates(status: AnalyzeJobStatus | undefined): [StepState, StepState, StepState] {
  if (status === "COMPLETED") {
    return ["done", "done", "done"];
  }
  if (status === "FAILED") {
    return ["done", "failed", "failed"];
  }
  if (status === "RUNNING" || status === "QUEUED") {
    return ["done", "active", "pending"];
  }
  return ["done", "active", "pending"];
}

function StepRow({
  title,
  description,
  state,
  withConnector,
}: {
  title: string;
  description: string;
  state: StepState;
  withConnector?: boolean;
}) {
  const wrapperOpacity = state === "pending" ? "opacity-50" : "opacity-100";
  const iconClass =
    state === "done"
      ? "bg-primary/10 text-primary"
      : state === "active"
        ? "bg-[#F59E0B]/10 text-[#F59E0B] ring-2 ring-[#F59E0B]/20 ring-offset-2"
        : state === "failed"
          ? "bg-red-100 text-red-600 ring-2 ring-red-200 ring-offset-2"
          : "border-2 border-slate-200 text-transparent";

  return (
    <div className={`relative flex items-center gap-4 ${wrapperOpacity}`}>
      {withConnector && <div className="absolute -top-5 left-4 h-5 w-px bg-slate-200" />}
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
        {state === "done" ? (
          <Check className="h-4 w-4" />
        ) : state === "active" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : state === "failed" ? (
          <X className="h-4 w-4" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-slate-300" />
        )}
      </div>
      <div className="flex flex-col items-start text-left">
        <span className="text-sm font-semibold text-slate-900">{title}</span>
        <span className="text-xs text-slate-500">{description}</span>
      </div>
    </div>
  );
}

export default function MeasurementAnalyzingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams<{ jobId: string }>();
  const { t } = useI18n();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const completedToastShown = useRef(false);
  const failedToastShown = useRef(false);
  const analyzeErrorHandled = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!jobId) {
      navigate("/profile", { replace: true });
    }
  }, [jobId, navigate]);

  const { data, isLoading, isError } = useAnalyzeJob(jobId ?? null, true, 2_000);
  const status = data?.status;

  const routeMeasurementModel = useMemo<MeasurementModel | null>(() => {
    const state = location.state;
    if (!state || typeof state !== "object") {
      return null;
    }
    const candidate = (state as { measurementModel?: unknown }).measurementModel;
    if (candidate === "quick" || candidate === "premium") {
      return candidate;
    }
    return null;
  }, [location.state]);

  const measurementModel = data?.measurementModel ?? routeMeasurementModel;
  const isPremium = measurementModel === "premium";
  const stepLabel = isPremium ? t("measureProgress.stepLabelPremium") : t("measureProgress.stepLabelQuick");

  const circleProgress = useMemo(() => getCircleProgress(status), [status]);
  const headerProgress = useMemo(() => getHeaderProgress(status), [status]);
  const [uploadState, meshState, analysisState] = useMemo(() => getStepStates(status), [status]);

  const meshDescription =
    meshState === "done"
      ? t("measureProgress.complete")
      : meshState === "failed"
        ? t("measureProgress.failed")
        : t("measureProgress.processing");
  const analysisDescription =
    analysisState === "done"
      ? t("measureProgress.complete")
      : analysisState === "failed"
        ? t("measureProgress.failed")
        : t("measureProgress.pending");

  useEffect(() => {
    if (isLoading || !isError || analyzeErrorHandled.current) {
      return;
    }

    analyzeErrorHandled.current = true;
    toast.error(t("measureProgress.failedToast"));
    navigate("/measure/info", {
      replace: true,
      state: measurementModel ? { measurementModel } : undefined,
    });
  }, [isError, isLoading, measurementModel, navigate, t]);

  useEffect(() => {
    if (status === "COMPLETED" && !completedToastShown.current) {
      completedToastShown.current = true;
      toast.success(t("measureProgress.completedToast"));
    }
  }, [status, t]);

  useEffect(() => {
    if (status !== "COMPLETED" || !jobId) {
      return;
    }

    const timer = window.setTimeout(() => {
      navigate(`/measure/result/${jobId}`, {
        replace: true,
        state: {
          measurementModel,
          autoCreateRecommendation: true,
        },
      });
    }, 900);

    return () => {
      window.clearTimeout(timer);
    };
  }, [status, jobId, measurementModel, navigate]);

  useEffect(() => {
    if (status === "FAILED" && !failedToastShown.current) {
      failedToastShown.current = true;
      toast.error(t("measureProgress.failedToast"));
    }
  }, [status, t]);

  useEffect(() => {
    if (status !== "FAILED") {
      return;
    }

    const timer = window.setTimeout(() => {
      navigate("/measure/info", {
        replace: true,
        state: measurementModel ? { measurementModel } : undefined,
      });
    }, 900);

    return () => {
      window.clearTimeout(timer);
    };
  }, [status, measurementModel, navigate]);

  const circleDashOffset = CIRCLE_CIRCUMFERENCE * (1 - circleProgress / 100);
  const showWarning = status !== "COMPLETED" && status !== "FAILED";
  const title =
    status === "COMPLETED"
      ? t("measureProgress.titleCompleted")
      : status === "FAILED"
        ? t("measureProgress.titleFailed")
        : t("measureProgress.titleRunning");
  const subtitle =
    status === "COMPLETED"
      ? t("measureProgress.subtitleCompleted")
      : status === "FAILED"
        ? t("measureProgress.subtitleFailed")
        : t("measureProgress.subtitleRunning");

  return (
    <div className="font-['Inter',sans-serif] min-h-screen bg-background text-slate-900">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 py-4 sm:px-8 sm:py-6">
        <header className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/profile", { replace: true })}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-[#EBF4FA]"
            aria-label={t("common.back")}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex w-full max-w-md flex-1 flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>{stepLabel}</span>
              <span>{headerProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#EBF4FA]">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${headerProgress}%` }} />
            </div>
          </div>

          <div className="w-10" />
        </header>
      </div>

      <main className="flex flex-1 items-center justify-center px-4 pb-8 pt-2 sm:px-6">
        <Card className="relative mx-auto w-full max-w-[480px] overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] sm:p-12">
          <div className="pointer-events-none absolute left-0 top-0 h-32 w-full bg-gradient-to-b from-primary/5 to-transparent" />

          <h1 className="relative z-10 mb-2 text-2xl font-bold text-slate-900">{title}</h1>
          <p className="relative z-10 mb-10 text-sm text-slate-500">{subtitle}</p>

          <div className="relative mx-auto mb-12 flex h-48 w-48 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100" aria-hidden>
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-[#EBF4FA]" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCLE_CIRCUMFERENCE}
                strokeDashoffset={circleDashOffset}
                className={`transition-all duration-700 ${status === "FAILED" ? "text-red-500" : "text-primary"}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold tracking-tighter text-slate-900">
                {isLoading && !data ? "--" : `${circleProgress}%`}
              </span>
              <span className={`mt-1 text-xs font-semibold uppercase tracking-wider ${status === "FAILED" ? "text-red-500" : "text-primary"}`}>
                {status === "FAILED" ? t("measureProgress.failed") : t("measureProgress.completeLabel")}
              </span>
            </div>
          </div>

          <div className="mx-auto mb-10 flex w-full max-w-sm flex-col gap-5">
            <StepRow title={t("measureProgress.stepUpload")} description={t("measureProgress.complete")} state={uploadState} />
            <StepRow
              withConnector
              title={t("measureProgress.stepMesh")}
              description={meshDescription}
              state={meshState}
            />
            <StepRow
              withConnector
              title={t("measureProgress.stepAnalysis")}
              description={analysisDescription}
              state={analysisState}
            />
          </div>

          {showWarning && (
            <div className="mb-6 flex w-full items-center gap-2 rounded-lg bg-red-50 px-4 py-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <p className="text-left text-xs font-medium text-red-500">{t("measureProgress.warning")}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (status === "COMPLETED" && jobId) {
                navigate(`/measure/result/${jobId}`, {
                  replace: true,
                  state: {
                    measurementModel,
                    autoCreateRecommendation: true,
                  },
                });
                return;
              }
              navigate("/profile", { replace: true });
            }}
            className="h-12 w-full rounded-full bg-[#EBF4FA] px-6 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
          >
            {status === "COMPLETED"
              ? t("measureProgress.viewResult")
              : showWarning
                ? t("measureProgress.cancel")
                : t("measureProgress.goMyPage")}
          </button>
        </Card>
      </main>
    </div>
  );
}
