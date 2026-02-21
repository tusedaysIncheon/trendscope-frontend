import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Crown,
  ExternalLink,
  Loader2,
  Ruler,
  Share2,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAnalyzeJob, useCreateAnalyzeShareLinkMutation } from "@/features/analyze/hooks/useAnalyze";
import {
  useCreateFashionRecommendationMutation,
  useFashionRecommendationHistory,
  useFashionRecommendationHistoryDetail,
} from "@/features/measurement/hooks/useFashionRecommendation";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ModelGlbViewer } from "@/shared/components/ModelGlbViewer";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { getFullImageUrl } from "@/shared/utils/image";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  AnalyzeResultPayload,
  FashionRecommendationRequest,
  MeasurementModel,
  PremiumAnalyzeResult,
  QuickAnalyzeResult,
} from "@/types/trendscope";

type JsonRecord = Record<string, unknown>;
type StrategyLine = {
  label: string;
  value: string;
};

type StrategySection = {
  title: string;
  lines: StrategyLine[];
};
type StrategyLabelResolver = {
  getTitle: (key: string) => string;
  getField: (key: string) => string;
};
const INSIGHT_SECTION_TITLE_CLASS = "mb-2 text-xs font-bold tracking-wide text-slate-500";
const INSIGHT_CARD_CLASS = "rounded-xl border border-slate-200 bg-white px-4 py-3.5";

const LENGTH_KEYS = [
  "shoulder_width_cm",
  "arm_length_cm",
  "leg_length_cm",
  "torso_length_cm",
] as const;

const CIRCUMFERENCE_KEYS = [
  "chest_cm",
  "waist_cm",
  "hip_cm",
  "thigh_cm",
] as const;

const CALCULATION_LABEL_KEYS: Record<string, string> = {
  leg_to_torso_ratio: "measureResult.calculationLegToTorsoRatio",
  threshold_long_leg: "measureResult.calculationThresholdLongLeg",
  ratio_result: "measureResult.calculationRatioResult",
};

const RATIO_RESULT_VALUE_KEYS: Record<string, string> = {
  long_leg: "measureResult.ratioResultLongLeg",
  balanced: "measureResult.ratioResultBalanced",
  short_leg: "measureResult.ratioResultShortLeg",
};

function isRecord(value: unknown): value is JsonRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function asRecord(value: unknown): JsonRecord | null {
  return isRecord(value) ? value : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    return null;
  }
  return value;
}

function meaningfulText(value: unknown): string | null {
  const text = asString(value).trim();
  if (!text) return null;
  const lower = text.toLowerCase();
  if (
    lower === "--" ||
    lower === "---" ||
    lower === "unknown" ||
    lower === "null" ||
    lower === "undefined" ||
    lower === "n/a" ||
    lower === "none"
  ) {
    return null;
  }
  return text;
}

function meaningfulList(value: unknown): string[] {
  return asArray(value)
    .map((item) => meaningfulText(item))
    .filter((item): item is string => Boolean(item));
}

function formatCm(value: number | null | undefined) {
  if (typeof value !== "number") return "--";
  const fixed = value.toFixed(2);
  return fixed.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function prettyKey(raw: string) {
  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStrategyTitleLabel(key: string, language: string): string {
  const isKorean = language.toLowerCase().startsWith("ko");
  const ko: Record<string, string> = {
    top_length: "상의 길이",
    bottom_fit: "하의 핏",
    shoulder_correction: "어깨 보정",
  };
  const en: Record<string, string> = {
    top_length: "Top Length",
    bottom_fit: "Bottom Fit",
    shoulder_correction: "Shoulder Correction",
  };
  return (isKorean ? ko[key] : en[key]) ?? prettyKey(key);
}

function getStrategyFieldLabel(key: string, language: string): string {
  const isKorean = language.toLowerCase().startsWith("ko");
  const ko: Record<string, string> = {
    recommendation: "추천",
    wearing_method: "연출법",
    reason: "이유",
    rise: "밑위",
    length: "기장",
    silhouette: "실루엣",
    neckline: "넥라인",
    shoulder_line: "어깨선",
  };
  const en: Record<string, string> = {
    recommendation: "Recommendation",
    wearing_method: "Wearing Method",
    reason: "Reason",
    rise: "Rise",
    length: "Length",
    silhouette: "Silhouette",
    neckline: "Neckline",
    shoulder_line: "Shoulder Line",
  };
  return (isKorean ? ko[key] : en[key]) ?? prettyKey(key);
}

function getDiagnosisTitleLabel(key: string, language: string): string {
  const isKorean = language.toLowerCase().startsWith("ko");
  const ko: Record<string, string> = {
    upper_lower_balance: "상하체 밸런스",
    shoulder_frame: "어깨 프레임",
    arm_balance: "팔 밸런스",
  };
  const en: Record<string, string> = {
    upper_lower_balance: "Upper/Lower Balance",
    shoulder_frame: "Shoulder Frame",
    arm_balance: "Arm Balance",
  };
  return (isKorean ? ko[key] : en[key]) ?? prettyKey(key);
}

function getOutfitFieldLabel(kind: "items" | "fitNotes", language: string): string {
  const isKorean = language.toLowerCase().startsWith("ko");
  if (kind === "items") return isKorean ? "아이템" : "Items";
  return isKorean ? "핏 포인트" : "Fit Notes";
}

function buildStrategySection(
  key: string,
  value: unknown,
  labels: StrategyLabelResolver
): StrategySection | null {
  const record = asRecord(value);

  if (!record) {
    const text = meaningfulText(value);
    if (!text) return null;
    return {
      title: labels.getTitle(key),
      lines: [{ label: labels.getField("recommendation"), value: text }],
    };
  }

  const lines: StrategyLine[] = [];

  if (key === "top_length") {
    const recommendation = meaningfulText(record.recommendation);
    const wearingMethod = meaningfulList(record.wearing_method);
    const reason = meaningfulText(record.reason);
    if (recommendation) lines.push({ label: labels.getField("recommendation"), value: recommendation });
    if (wearingMethod.length > 0) lines.push({ label: labels.getField("wearing_method"), value: wearingMethod.join(" · ") });
    if (reason) lines.push({ label: labels.getField("reason"), value: reason });
  } else if (key === "bottom_fit") {
    const rise = meaningfulText(record.rise);
    const length = meaningfulText(record.length);
    const silhouette = meaningfulText(record.silhouette);
    const reason = meaningfulText(record.reason);
    if (rise) lines.push({ label: labels.getField("rise"), value: rise });
    if (length) lines.push({ label: labels.getField("length"), value: length });
    if (silhouette) lines.push({ label: labels.getField("silhouette"), value: silhouette });
    if (reason) lines.push({ label: labels.getField("reason"), value: reason });
  } else if (key === "shoulder_correction") {
    const neckline = meaningfulList(record.neckline);
    const shoulderLine = meaningfulList(record.shoulder_line);
    const reason = meaningfulText(record.reason);
    if (neckline.length > 0) lines.push({ label: labels.getField("neckline"), value: neckline.join(" · ") });
    if (shoulderLine.length > 0) lines.push({ label: labels.getField("shoulder_line"), value: shoulderLine.join(" · ") });
    if (reason) lines.push({ label: labels.getField("reason"), value: reason });
  } else {
    Object.entries(record).forEach(([subKey, subValue]) => {
      if (Array.isArray(subValue)) {
        const list = meaningfulList(subValue);
        if (list.length > 0) {
          lines.push({ label: labels.getField(subKey), value: list.join(" · ") });
        }
        return;
      }
      const text = meaningfulText(subValue);
      if (text) {
        lines.push({ label: labels.getField(subKey), value: text });
      }
    });
  }

  if (lines.length === 0) return null;
  return { title: labels.getTitle(key), lines };
}

async function copyText(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return;
  }
  throw new Error("clipboard_unavailable");
}

function isSuccessAnalyzeResult(
  value: AnalyzeResultPayload | null
): value is QuickAnalyzeResult | PremiumAnalyzeResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  if ((value as { success?: unknown }).success !== true) {
    return false;
  }

  return asRecord((value as { lengths?: unknown }).lengths) !== null;
}

function isPremiumAnalyzeResult(
  value: QuickAnalyzeResult | PremiumAnalyzeResult
): value is PremiumAnalyzeResult {
  return asRecord((value as { circumferences?: unknown }).circumferences) !== null;
}

function ResultMetricRow({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-sm font-bold text-slate-900">
        {formatCm(value)} <span className="text-xs font-medium text-slate-400">cm</span>
      </span>
    </div>
  );
}

function RecommendationSimpleField({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  const text = asString(value) || "--";
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{text}</p>
    </div>
  );
}

export default function MeasurementResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams<{ jobId: string }>();
  const { t, language } = useI18n();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    data: analyzeData,
    isLoading: isAnalyzeLoading,
    isError: isAnalyzeError,
  } = useAnalyzeJob(jobId ?? null, true, 2_000);
  const {
    data: recommendationHistory,
    isLoading: isRecommendationHistoryLoading,
    refetch: refetchRecommendationHistory,
  } = useFashionRecommendationHistory(100);
  const matchedHistory = useMemo(() => {
    if (!jobId) return null;
    return recommendationHistory?.histories.find((item) => item.jobId === jobId) ?? null;
  }, [jobId, recommendationHistory?.histories]);
  const { data: recommendationDetail, isLoading: isRecommendationDetailLoading } =
    useFashionRecommendationHistoryDetail(matchedHistory?.userSeq ?? null);
  const {
    mutateAsync: createRecommendation,
    data: createdRecommendation,
    isPending: isCreatingRecommendation,
  } = useCreateFashionRecommendationMutation();
  const {
    mutateAsync: createShareLink,
    isPending: isCreatingShareLink,
  } = useCreateAnalyzeShareLinkMutation();
  const createRequestedRef = useRef(false);

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
  const autoCreateRecommendationFromRoute = useMemo(() => {
    const state = location.state;
    if (!state || typeof state !== "object") {
      return false;
    }
    return (state as { autoCreateRecommendation?: unknown }).autoCreateRecommendation === true;
  }, [location.state]);

  const analyzeResult = analyzeData?.result ?? null;
  const successResult = isSuccessAnalyzeResult(analyzeResult) ? analyzeResult : null;
  const glbViewerUrl = analyzeData?.glbDownloadUrl || getFullImageUrl(analyzeData?.glbObjectKey);
  const measurementModel =
    analyzeData?.measurementModel ??
    (successResult && isPremiumAnalyzeResult(successResult) ? "premium" : null) ??
    routeMeasurementModel;
  const isPremium = measurementModel === "premium";
  const locationHint = useMemo(() => {
    if (typeof window === "undefined") return "";

    const locale = window.navigator?.language?.trim() ?? "";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone?.trim() ?? "";
    if (locale && timezone) return `${locale}, ${timezone}`;
    return locale || timezone || "";
  }, []);
  const recommendationPayload = useMemo<FashionRecommendationRequest | null>(() => {
    if (!jobId) return null;
    return {
      jobId,
      language,
      location: locationHint || undefined,
    };
  }, [jobId, language, locationHint]);

  useEffect(() => {
    if (!jobId || isAnalyzeLoading || !isAnalyzeError) {
      return;
    }
    toast.error(t("measureResult.failedDescription"));
    navigate("/profile", { replace: true });
  }, [isAnalyzeError, isAnalyzeLoading, jobId, navigate, t]);

  const recommendation = useMemo(() => {
    return (
      asRecord(recommendationDetail?.recommendation) ??
      asRecord(createdRecommendation?.recommendation) ??
      null
    );
  }, [createdRecommendation?.recommendation, recommendationDetail?.recommendation]);

  useEffect(() => {
    if (!jobId || !recommendationPayload) return;
    if (!autoCreateRecommendationFromRoute) return;
    if (analyzeData?.status !== "COMPLETED") return;
    if (!successResult) return;
    if (recommendation) return;
    if (isRecommendationHistoryLoading || isRecommendationDetailLoading || isCreatingRecommendation) return;
    if (createRequestedRef.current) return;

    createRequestedRef.current = true;
    createRecommendation(recommendationPayload)
      .then(() => {
        refetchRecommendationHistory();
      })
      .catch(() => {
        createRequestedRef.current = false;
        toast.error(t("measureResult.createRecommendationError"));
      });
  }, [
    analyzeData?.status,
    createRecommendation,
    isCreatingRecommendation,
    isRecommendationDetailLoading,
    isRecommendationHistoryLoading,
    jobId,
    recommendationPayload,
    recommendation,
    refetchRecommendationHistory,
    successResult,
    t,
    autoCreateRecommendationFromRoute,
  ]);

  const calculations = asRecord(recommendation?.calculations);
  const diagnosis = asRecord(recommendation?.diagnosis);
  const strategy = asRecord(recommendation?.strategy);
  const outfitGuide = asArray(recommendation?.outfit_guide).filter(isRecord);
  const keyItems = asArray(recommendation?.key_items).filter(isRecord);
  const sources = asArray(recommendation?.sources).filter(isRecord);
  const lengths = successResult ? asRecord(successResult.lengths) : null;
  const circumferences =
    successResult && isPremiumAnalyzeResult(successResult)
      ? asRecord(successResult.circumferences)
      : null;
  const strategySections = useMemo(
    () =>
      strategy
        ? Object.entries(strategy)
            .map(([key, value]) =>
              buildStrategySection(key, value, {
                getTitle: (sectionKey) => getStrategyTitleLabel(sectionKey, language),
                getField: (fieldKey) => getStrategyFieldLabel(fieldKey, language),
              })
            )
            .filter((section): section is StrategySection => section !== null)
        : [],
    [strategy, language]
  );

  const handleCreateRecommendation = async () => {
    if (!jobId || !recommendationPayload) return;
    try {
      await createRecommendation(recommendationPayload);
      await refetchRecommendationHistory();
      toast.success(t("measureResult.createRecommendationSuccess"));
    } catch {
      toast.error(t("measureResult.createRecommendationError"));
    }
  };

  const handleShareResult = async () => {
    if (!jobId) {
      toast.error(t("measureResult.shareError"));
      return;
    }

    let shareUrl = "";
    try {
      const response = await createShareLink(jobId);
      shareUrl = response.shareUrl;
    } catch {
      toast.error(t("measureResult.shareError"));
      return;
    }

    if (!shareUrl) {
      toast.error(t("measureResult.shareError"));
      return;
    }

    const shareData = {
      title: t("measureResult.title"),
      text: t("measureResult.shareText"),
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success(t("measureResult.shareSuccess"));
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await copyText(shareUrl);
      toast.success(t("measureResult.shareSuccess"));
    } catch {
      toast.error(t("measureResult.shareError"));
    }
  };

  if (isAnalyzeLoading && !analyzeData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-[480px] rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="mt-3 text-sm text-slate-500">{t("measureResult.loading")}</p>
        </Card>
      </div>
    );
  }

  if (!jobId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-[480px] rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">{t("measureResult.failedTitle")}</h1>
          <p className="mt-2 text-sm text-slate-500">{t("measureResult.failedDescription")}</p>
          <button
            type="button"
            onClick={() => navigate("/profile", { replace: true })}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white"
          >
            {t("measureResult.goMyPage")}
          </button>
        </Card>
      </div>
    );
  }

  if (!analyzeData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-[480px] rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="mt-3 text-sm text-slate-500">{t("measureResult.loading")}</p>
          <button
            type="button"
            onClick={() => navigate("/profile", { replace: true })}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white"
          >
            {t("measureResult.goMyPage")}
          </button>
        </Card>
      </div>
    );
  }

  if (analyzeData.status === "QUEUED" || analyzeData.status === "RUNNING") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-[480px] rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">{t("measureResult.resultPendingTitle")}</h1>
          <p className="mt-2 text-sm text-slate-500">{t("measureResult.resultPendingDescription")}</p>
          <button
            type="button"
            onClick={() => navigate(`/measure/analyzing/${jobId}`, { replace: true })}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("measureResult.backToProgress")}
          </button>
        </Card>
      </div>
    );
  }

  if (analyzeData.status === "FAILED" || !successResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-[480px] rounded-2xl border border-red-100 bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">{t("measureResult.failedTitle")}</h1>
          <p className="mt-2 text-sm text-slate-500">{analyzeData.errorDetail ?? t("measureResult.failedDescription")}</p>
          <button
            type="button"
            onClick={() => navigate("/profile", { replace: true })}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white"
          >
            {t("measureResult.goMyPage")}
          </button>
        </Card>
      </div>
    );
  }

  const metricLabels: Record<string, string> = {
    shoulder_width_cm: t("measureResult.metricShoulderWidth"),
    arm_length_cm: t("measureResult.metricArmLength"),
    leg_length_cm: t("measureResult.metricLegLength"),
    torso_length_cm: t("measureResult.metricTorsoLength"),
    inseam_cm: t("measureResult.metricInseam"),
    chest_cm: t("measureResult.metricChest"),
    waist_cm: t("measureResult.metricWaist"),
    hip_cm: t("measureResult.metricHip"),
    thigh_cm: t("measureResult.metricThigh"),
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="flex items-center gap-2 text-slate-900 transition-opacity hover:opacity-80"
          >
            <img src="/logo1.png" alt={t("common.appName")} className="h-8 w-8 rounded-sm object-contain" />
            <span className="text-lg font-black tracking-tight">{t("common.appName")}</span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate("/profile", { replace: true })}
              className="h-8 whitespace-nowrap rounded-full px-3 text-[11px] font-bold sm:h-9 sm:px-4 sm:text-xs"
            >
              <span className="inline-block translate-y-[0.5px]">{t("common.myPage")}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-4 py-8">
        <div className="mb-8 space-y-6">
          <div>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("measureResult.analysisComplete")}</span>
              <span className="text-xs font-bold text-slate-900">100%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-full rounded-full bg-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-slate-900">{t("measureResult.title")}</h1>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold text-amber-700 bg-amber-100 border-amber-200">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  {isPremium ? t("measureResult.premiumBadge") : t("measureResult.quickBadge")}
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleShareResult}
                disabled={isCreatingShareLink}
                className="h-10 shrink-0 rounded-full px-5 text-sm font-bold"
              >
                {isCreatingShareLink ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="mr-1.5 h-4 w-4" />
                )}
                <span>{t("measureResult.shareButton")}</span>
              </Button>
            </div>
            <p className="text-base leading-relaxed text-slate-500">{t("measureResult.subtitle")}</p>
            <p className="text-xs font-medium text-amber-700">{t("measureResult.measurementToleranceNotice")}</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">{t("measureResult.viewerTitle")}</h2>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {t("measureResult.viewerBadge")}
              </span>
            </div>
            <ModelGlbViewer
              src={glbViewerUrl}
              appearance="studio"
              className="h-[460px] w-full sm:h-[560px]"
              autoRotate
              cameraOrbit="0deg 76deg 4.8m"
              emptyMessage={t("measureResult.viewerEmpty")}
              errorMessage={t("measureResult.viewerError")}
            />
            <p className="mt-3 text-xs leading-relaxed text-slate-500">{t("measureResult.viewerHint")}</p>
          </Card>

          <Card className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Ruler className="h-4 w-4 text-primary" />
                {t("measureResult.measurements")}
              </h2>
              <span className="text-xs font-medium text-slate-400">{t("measureResult.centimeters")}</span>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  {t("measureResult.lengths")}
                </h3>
                <div className="space-y-2">
                  {LENGTH_KEYS.map((key) => (
                    <ResultMetricRow
                      key={key}
                      label={metricLabels[key] ?? prettyKey(key)}
                      value={asFiniteNumber(lengths?.[key])}
                    />
                  ))}
                </div>
              </div>

              {isPremiumAnalyzeResult(successResult) && (
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                    {t("measureResult.circumferences")}
                  </h3>
                  <div className="space-y-2">
                    {CIRCUMFERENCE_KEYS.map((key) => (
                      <ResultMetricRow
                        key={key}
                        label={metricLabels[key] ?? prettyKey(key)}
                        value={asFiniteNumber(circumferences?.[key])}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">{t("measureResult.aiTitle")}</h2>
            </div>

            {!recommendation && (isRecommendationHistoryLoading || isRecommendationDetailLoading || isCreatingRecommendation) && (
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>{t("measureResult.aiGenerating")}</span>
              </div>
            )}

            {!recommendation &&
              !(isRecommendationHistoryLoading || isRecommendationDetailLoading || isCreatingRecommendation) && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center">
                  <p className="text-sm text-slate-600">{t("measureResult.aiEmpty")}</p>
                  <button
                    type="button"
                    onClick={handleCreateRecommendation}
                    className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-bold text-white"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {t("measureResult.generateAi")}
                  </button>
                </div>
              )}

            {recommendation && (
              <div className="space-y-5">
                {calculations && (
                  <div>
                    <h3 className={INSIGHT_SECTION_TITLE_CLASS}>
                      {t("measureResult.calculations")}
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Object.entries(calculations).map(([key, value]) => {
                        const translatedKey = CALCULATION_LABEL_KEYS[key];
                        const label = translatedKey ? t(translatedKey) : prettyKey(key);
                        let normalizedValue: unknown = value;
                        if (key === "ratio_result" && typeof value === "string") {
                          const translatedValueKey = RATIO_RESULT_VALUE_KEYS[value.toLowerCase()];
                          normalizedValue = translatedValueKey ? t(translatedValueKey) : value;
                        }
                        return (
                          <RecommendationSimpleField
                            key={key}
                            label={label}
                            value={normalizedValue}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {diagnosis && (
                  <div>
                    <h3 className={INSIGHT_SECTION_TITLE_CLASS}>
                      {t("measureResult.diagnosis")}
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(diagnosis).map(([key, value]) => {
                        const record = asRecord(value);
                        if (!record) return null;
                        const analysis = meaningfulText(record.analysis);
                        const direction = meaningfulText(record.style_direction);
                        if (!analysis && !direction) return null;
                        return (
                          <div key={key} className={INSIGHT_CARD_CLASS}>
                            <p className="text-sm font-bold text-slate-800">{getDiagnosisTitleLabel(key, language)}</p>
                            {analysis && <p className="mt-1.5 text-base leading-relaxed font-semibold text-slate-900">{analysis}</p>}
                            {direction && <p className="mt-1 text-sm leading-relaxed text-slate-600">{direction}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {strategySections.length > 0 && (
                  <div>
                    <h3 className={INSIGHT_SECTION_TITLE_CLASS}>
                      {t("measureResult.strategy")}
                    </h3>
                    <div className="space-y-2">
                      {strategySections.map((section) => (
                        <div key={section.title} className={INSIGHT_CARD_CLASS}>
                          <p className="text-sm font-bold text-slate-800">{section.title}</p>
                          <div className="mt-2 space-y-1.5">
                            {section.lines.map((line, lineIndex) => (
                              <div key={`${section.title}-${lineIndex}`} className="grid grid-cols-1 items-start gap-1.5 text-sm sm:grid-cols-[96px_1fr] sm:gap-2">
                                <span className="font-semibold text-slate-600 sm:pt-0.5">{line.label}</span>
                                <span className="leading-relaxed text-slate-800">{line.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {outfitGuide.length > 0 && (
                  <div>
                    <h3 className={INSIGHT_SECTION_TITLE_CLASS}>
                      {t("measureResult.outfitGuide")}
                    </h3>
                    <div className="space-y-2">
                      {outfitGuide.map((guide, index) => (
                        <div key={`outfit-${index}`} className={INSIGHT_CARD_CLASS}>
                          <p className="text-sm font-semibold text-slate-900">{asString(guide.title) || `Outfit ${index + 1}`}</p>
                          <div className="mt-2 space-y-1.5 text-sm">
                            <div className="grid grid-cols-1 items-start gap-1.5 text-sm sm:grid-cols-[96px_1fr] sm:gap-2">
                              <span className="font-semibold text-slate-600 sm:pt-0.5">{getOutfitFieldLabel("items", language)}</span>
                              <span className="leading-relaxed text-slate-800">
                                {asArray(guide.items).map((item) => asString(item)).filter(Boolean).join(", ") || "--"}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 items-start gap-1.5 text-sm sm:grid-cols-[96px_1fr] sm:gap-2">
                              <span className="font-semibold text-slate-600 sm:pt-0.5">{getOutfitFieldLabel("fitNotes", language)}</span>
                              <span className="leading-relaxed text-slate-700">
                                {asArray(guide.fit_notes).map((note) => asString(note)).filter(Boolean).join(" · ") || "--"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {keyItems.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                      {t("measureResult.keyItems")}
                    </h3>
                    <div className="space-y-2">
                      {keyItems.map((item, index) => {
                        const products = asArray(item.example_products).filter(isRecord);
                        return (
                          <div key={`key-item-${index}`} className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                            <p className="text-sm font-semibold text-slate-900">{asString(item.name) || prettyKey(`item_${index + 1}`)}</p>
                            <p className="mt-1 text-xs text-slate-600">{asString(item.why) || "--"}</p>
                            {products.length > 0 && (
                              <div className="mt-2 space-y-1.5">
                                {products.map((product, productIndex) => {
                                  const url = asString(product.url);
                                  return (
                                    <a
                                      key={`product-${index}-${productIndex}`}
                                      href={url || "#"}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-700 transition-colors hover:bg-slate-100"
                                    >
                                      <span className="truncate pr-2">
                                        {asString(product.platform) || "Shop"} · {asString(product.product_name) || "--"}
                                      </span>
                                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {sources.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                      {t("measureResult.sources")}
                    </h3>
                    <div className="space-y-1.5">
                      {sources.map((source, index) => {
                        const url = asString(source.url);
                        return (
                          <a
                            key={`source-${index}`}
                            href={url || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            <span className="truncate pr-2">
                              {asString(source.name) || t("measureResult.sourceUnknown")}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {!isPremium && (
            <Card className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-[#eaf4ff] via-[#f4f9ff] to-[#eef7ff] p-0 shadow-[0_22px_48px_-24px_rgba(60,145,230,0.65)]">
              <div className="pointer-events-none absolute -left-12 top-8 h-36 w-36 rounded-full bg-primary/20 blur-3xl" />
              <div className="pointer-events-none absolute -right-14 bottom-4 h-36 w-36 rounded-full bg-[#FA824C]/20 blur-3xl" />

              <div className="relative p-5 sm:p-6">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                  <Crown className="h-3.5 w-3.5" />
                  {t("measureResult.premiumUpsellEyebrow")}
                </div>

                <h3 className="mt-3 text-2xl font-black leading-tight tracking-tight text-slate-900">
                  {t("measureResult.premiumUpsellTitle")}{" "}
                  <span className="text-primary">{t("measureResult.premiumUpsellHighlight")}</span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {t("measureResult.premiumUpsellSubtitle")}
                </p>

                <div className="mt-4 space-y-2.5 rounded-xl border border-white/70 bg-white/75 p-3.5 backdrop-blur">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm font-semibold text-slate-800">{t("measureResult.premiumUpsellFeature1")}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm font-semibold text-slate-800">{t("measureResult.premiumUpsellFeature2")}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm font-semibold text-slate-800">{t("measureResult.premiumUpsellFeature3")}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-primary/20 bg-white/85 px-3.5 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    {t("measureResult.premiumUpsellPriceLabel")}
                  </p>
                  <div className="mt-1 flex items-end justify-between">
                    <p className="text-3xl font-black tracking-tight text-slate-900">$5.99</p>
                    <p className="text-xs font-semibold text-slate-500">{t("measureResult.premiumUpsellTaxIncluded")}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/payment")}
                  className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#2c7fd1] px-5 text-sm font-black text-white shadow-[0_16px_28px_-16px_rgba(60,145,230,0.95)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_32px_-16px_rgba(60,145,230,1)] active:translate-y-0"
                >
                  {t("measureResult.premiumUpsellAction")}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-3 text-center text-xs font-medium text-slate-500">
                  {t("measureResult.premiumUpsellFootnote")}
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
