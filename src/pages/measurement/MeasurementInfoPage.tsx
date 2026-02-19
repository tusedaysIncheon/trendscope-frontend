import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Card } from "@/shared/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import type { AnalyzeMode, Gender, MeasurementModel } from "@/types/trendscope";
import type { MeasureFlowState } from "./types";

const HEIGHT_MIN_CM = 100;
const HEIGHT_MAX_CM = 230;
const WEIGHT_MIN_KG = 20;
const WEIGHT_MAX_KG = 300;

type MeasurementInfoRouteState = {
  measurementModel?: MeasurementModel;
};

function resolveMeasurementModel(
  routeState: MeasurementInfoRouteState | null,
  searchParams: URLSearchParams
): MeasurementModel {
  if (routeState?.measurementModel === "quick" || routeState?.measurementModel === "premium") {
    return routeState.measurementModel;
  }

  const queryModel = searchParams.get("model");
  if (queryModel === "quick" || queryModel === "premium") {
    return queryModel;
  }

  return "quick";
}

function toAnalyzeMode(model: MeasurementModel): AnalyzeMode {
  return model === "quick" ? "QUICK_1VIEW" : "STANDARD_2VIEW";
}

export default function MeasurementInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const measurementModel = useMemo(() => {
    return resolveMeasurementModel(
      (location.state as MeasurementInfoRouteState | null) ?? null,
      new URLSearchParams(location.search)
    );
  }, [location.search, location.state]);

  const [gender, setGender] = useState<Gender>("female");
  const [heightValue, setHeightValue] = useState("");
  const [weightValue, setWeightValue] = useState("");

  const handleNext = (event: React.FormEvent) => {
    event.preventDefault();

    const heightCm = Number(heightValue);
    const hasValidHeight =
      Number.isFinite(heightCm) && heightCm >= HEIGHT_MIN_CM && heightCm <= HEIGHT_MAX_CM;
    if (!hasValidHeight) {
      toast.error(
        t("measureInfo.invalidHeightRange", {
          min: HEIGHT_MIN_CM,
          max: HEIGHT_MAX_CM,
        })
      );
      return;
    }

    const trimmedWeight = weightValue.trim();
    let parsedWeight: number | undefined;
    if (trimmedWeight) {
      parsedWeight = Number(trimmedWeight);
    }

    const hasValidWeight =
      parsedWeight !== undefined &&
      Number.isFinite(parsedWeight) &&
      parsedWeight >= WEIGHT_MIN_KG &&
      parsedWeight <= WEIGHT_MAX_KG;
    if (trimmedWeight && !hasValidWeight) {
      toast.error(
        t("measureInfo.invalidWeightRange", {
          min: WEIGHT_MIN_KG,
          max: WEIGHT_MAX_KG,
        })
      );
      return;
    }

    const state: MeasureFlowState = {
      measurementModel,
      mode: toAnalyzeMode(measurementModel),
      gender,
      heightCm,
      weightKg: parsedWeight,
    };

    navigate("/measure/photos", { state, replace: true });
  };

  return (
    <div className="font-['Inter',sans-serif] flex min-h-screen w-full items-center justify-center bg-background px-0">
      <div className="flex min-h-screen w-full max-w-[480px] flex-col border-x border-border bg-background text-foreground shadow-xl shadow-slate-300/40 lg:max-w-none lg:border-x-0 lg:shadow-none">
        <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/", { replace: true })}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 transition-colors hover:bg-slate-100"
              aria-label={t("common.back")}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="hidden text-xl font-bold tracking-tight sm:block">{t("common.appName")}</span>
          </div>

          <div className="mx-4 w-full max-w-md sm:mx-8">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[15%] rounded-full bg-primary" />
            </div>
          </div>

          <div className="w-10" />
        </header>

        <main className="relative flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
          <div className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full bg-primary/10 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-12 -left-16 h-72 w-72 rounded-full bg-blue-200/15 blur-[90px]" />

          <div className="w-full max-w-[480px]">
            <Card className="mb-6 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10">
              <div className="mb-8 space-y-3 text-center sm:text-left">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {measurementModel === "quick" ? t("measureInfo.quickBadge") : t("measureInfo.premiumBadge")}
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("measureInfo.title")}</h1>
                <p className="text-slate-500">{t("measureInfo.subtitle")}</p>
              </div>

              <form className="flex flex-col gap-6" onSubmit={handleNext}>
                <div className="space-y-3">
                  <label className="block pl-1 text-sm font-semibold text-slate-900">{t("measureInfo.genderLabel")}</label>
                  <div className="grid grid-cols-2 rounded-full bg-slate-100 p-1.5">
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`w-full rounded-full py-3 text-sm font-medium transition-all ${
                        gender === "female"
                          ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {t("measureInfo.female")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`w-full rounded-full py-3 text-sm font-medium transition-all ${
                        gender === "male"
                          ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {t("measureInfo.male")}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block pl-1 text-sm font-semibold text-slate-900">{t("measureInfo.heightLabel")}</label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={HEIGHT_MIN_CM}
                      max={HEIGHT_MAX_CM}
                      step="0.1"
                      placeholder="170"
                      value={heightValue}
                      onChange={(event) => setHeightValue(event.target.value)}
                      className="h-14 w-full rounded-full border border-slate-200 bg-white pl-6 pr-16 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 font-medium text-slate-500">
                      cm
                    </span>
                  </div>
                  <p className="pl-2 text-xs text-slate-500">
                    {t("measureInfo.heightRangeHint", {
                      min: HEIGHT_MIN_CM,
                      max: HEIGHT_MAX_CM,
                    })}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="block text-sm font-semibold text-slate-900">{t("measureInfo.weightLabel")}</label>
                    <span className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1 text-xs text-slate-500">
                      {t("measureInfo.optional")}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={WEIGHT_MIN_KG}
                      max={WEIGHT_MAX_KG}
                      step="0.1"
                      placeholder="65"
                      value={weightValue}
                      onChange={(event) => setWeightValue(event.target.value)}
                      className="h-14 w-full rounded-full border border-slate-200 bg-white pl-6 pr-16 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 font-medium text-slate-500">
                      kg
                    </span>
                  </div>
                  <p className="pl-2 text-xs text-slate-500">
                    {t("measureInfo.weightHint")}{" "}
                    {t("measureInfo.weightRangeHint", {
                      min: WEIGHT_MIN_KG,
                      max: WEIGHT_MAX_KG,
                    })}
                  </p>
                </div>

                <button
                  type="submit"
                  className="flex h-14 w-full transform items-center justify-center gap-2 rounded-full bg-primary font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-[#327ac2] active:scale-[0.98]"
                >
                  <span>{t("measureInfo.next")}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
