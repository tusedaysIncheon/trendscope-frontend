import { ArrowRight, Loader2, Ruler } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useSharedAnalyzeJob } from "@/features/analyze/hooks/useAnalyze";
import { ModelGlbViewer } from "@/shared/components/ModelGlbViewer";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import type { AnalyzeResultPayload, PremiumAnalyzeResult, QuickAnalyzeResult } from "@/types/trendscope";

type JsonRecord = Record<string, unknown>;

const LENGTH_KEYS = ["shoulder_width_cm", "arm_length_cm", "leg_length_cm", "torso_length_cm"] as const;
const CIRCUMFERENCE_KEYS = ["chest_cm", "waist_cm", "hip_cm", "thigh_cm"] as const;

function isRecord(value: unknown): value is JsonRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function asRecord(value: unknown): JsonRecord | null {
  return isRecord(value) ? value : null;
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    return null;
  }
  return value;
}

function formatCm(value: number | null | undefined) {
  if (typeof value !== "number") return "--";
  const fixed = value.toFixed(2);
  return fixed.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
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

export default function MeasurementSharedResultPage() {
  const navigate = useNavigate();
  const { shareToken } = useParams<{ shareToken: string }>();
  const { t } = useI18n();

  const { data, isLoading, isError } = useSharedAnalyzeJob(shareToken ?? null);

  const result = data?.result ?? null;
  const successResult = isSuccessAnalyzeResult(result) ? result : null;
  const isPremium = data?.measurementModel === "premium";

  const metricLabels: Record<string, string> = {
    shoulder_width_cm: t("measureResult.metricShoulderWidth"),
    arm_length_cm: t("measureResult.metricArmLength"),
    leg_length_cm: t("measureResult.metricLegLength"),
    torso_length_cm: t("measureResult.metricTorsoLength"),
    chest_cm: t("measureResult.metricChest"),
    waist_cm: t("measureResult.metricWaist"),
    hip_cm: t("measureResult.metricHip"),
    thigh_cm: t("measureResult.metricThigh"),
  };

  const lengths = successResult ? asRecord(successResult.lengths) : null;
  const circumferences =
    successResult && isPremiumAnalyzeResult(successResult)
      ? asRecord(successResult.circumferences)
      : null;

  const isInvalid = useMemo(() => {
    if (!shareToken || isError || !data) return true;
    if (data.status !== "COMPLETED") return true;
    if (!successResult) return true;
    return false;
  }, [data, isError, shareToken, successResult]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-[480px] rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="mt-3 text-sm text-slate-500">{t("measureResult.loading")}</p>
        </Card>
      </div>
    );
  }

  if (isInvalid || !data || !successResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-[500px] rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">{t("measureResult.sharedInvalidTitle")}</h1>
          <p className="mt-2 text-sm text-slate-500">{t("measureResult.sharedInvalidDescription")}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Button
              type="button"
              onClick={() => navigate("/measure/info")}
              className="h-10 rounded-full px-5 text-sm font-bold"
            >
              {t("measureResult.sharedStartCta")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/login")}
              className="h-10 rounded-full px-5 text-sm font-bold"
            >
              {t("measureResult.sharedLoginCta")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-900 transition-opacity hover:opacity-80"
          >
            <img src="/logo1.png" alt={t("common.appName")} className="h-8 w-8 rounded-sm object-contain" />
            <span className="text-lg font-black tracking-tight">{t("common.appName")}</span>
          </button>

          <Button
            type="button"
            size="sm"
            onClick={() => navigate("/measure/info")}
            className="h-9 rounded-full px-4 text-xs font-bold"
          >
            {t("common.start")}
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-4 py-8">
        <div className="mb-8 space-y-3">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {t("measureResult.sharedResultEyebrow")}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">{t("measureResult.sharedResultTitle")}</h1>
          <p className="text-base leading-relaxed text-slate-500">{t("measureResult.sharedResultDescription")}</p>
          <p className="text-xs font-medium text-amber-700">{t("measureResult.measurementToleranceNotice")}</p>
        </div>

        <div className="space-y-6">
          <Card className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">{t("measureResult.viewerTitle")}</h2>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {isPremium ? t("measureResult.premiumBadge") : t("measureResult.quickBadge")}
              </span>
            </div>
            <ModelGlbViewer
              src={data.glbDownloadUrl ?? ""}
              appearance="studio"
              className="h-[460px] w-full sm:h-[560px]"
              autoRotate
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
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{t("measureResult.lengths")}</h3>
                <div className="space-y-2">
                  {LENGTH_KEYS.map((key) => (
                    <ResultMetricRow
                      key={key}
                      label={metricLabels[key] ?? key}
                      value={asFiniteNumber(lengths?.[key])}
                    />
                  ))}
                </div>
              </div>

              {isPremiumAnalyzeResult(successResult) && (
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{t("measureResult.circumferences")}</h3>
                  <div className="space-y-2">
                    {CIRCUMFERENCE_KEYS.map((key) => (
                      <ResultMetricRow
                        key={key}
                        label={metricLabels[key] ?? key}
                        value={asFiniteNumber(circumferences?.[key])}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <h2 className="text-lg font-bold text-slate-900">{t("measureResult.sharedCtaTitle")}</h2>
            <p className="mt-2 text-sm text-slate-600">{t("measureResult.sharedCtaDescription")}</p>
            <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row">
              <Button type="button" onClick={() => navigate("/measure/info")} className="h-10 rounded-full px-5 text-sm font-bold">
                {t("measureResult.sharedStartCta")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/login")}
                className="h-10 rounded-full px-5 text-sm font-bold"
              >
                {t("measureResult.sharedLoginCta")}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
