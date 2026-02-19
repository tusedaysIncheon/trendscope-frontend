import { ArrowLeft, ArrowRight, ImageUp, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAnalyzePipelineMutation } from "@/features/analyze/hooks/useAnalyze";
import { getApiErrorMessage } from "@/lib/api/error";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Card } from "@/shared/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import type { MeasureFlowState } from "./types";

function isFileLike(value: unknown): value is File {
  return (
    !!value &&
    typeof value === "object" &&
    "name" in value &&
    "size" in value &&
    "type" in value
  );
}

function isMeasureFlowState(value: unknown): value is MeasureFlowState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<MeasureFlowState>;
  const validModel = candidate.measurementModel === "quick" || candidate.measurementModel === "premium";
  const validMode = candidate.mode === "QUICK_1VIEW" || candidate.mode === "STANDARD_2VIEW";
  const validGender =
    candidate.gender === "female" || candidate.gender === "male" || candidate.gender === "other";

  return validModel && validMode && validGender && typeof candidate.heightCm === "number";
}

export default function MeasurementPhotoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { mutateAsync: startPipeline, isPending } = useAnalyzePipelineMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const flowState = useMemo<MeasureFlowState | null>(() => {
    const state = location.state;
    return isMeasureFlowState(state) ? state : null;
  }, [location.state]);

  useEffect(() => {
    if (!flowState) {
      navigate("/measure/info", { replace: true });
    }
  }, [flowState, navigate]);

  const [frontFile, setFrontFile] = useState<File | null>(() => {
    const candidate = (location.state as { frontFile?: unknown } | null)?.frontFile;
    return isFileLike(candidate) ? candidate : null;
  });
  const [frontPreviewUrl, setFrontPreviewUrl] = useState<string | null>(null);
  const [frontFileError, setFrontFileError] = useState(false);
  const [isFrontExampleVisible, setIsFrontExampleVisible] = useState(true);
  const [frontExampleIndex, setFrontExampleIndex] = useState(0);

  if (!flowState) {
    return null;
  }

  const requiresSideImage = flowState.measurementModel === "premium";
  const FRONT_EXAMPLE_IMAGE_SOURCES = ["/front-example.png"];
  const frontExampleSrc = FRONT_EXAMPLE_IMAGE_SOURCES[Math.min(frontExampleIndex, FRONT_EXAMPLE_IMAGE_SOURCES.length - 1)];
  const hasFrontPreview = Boolean(frontPreviewUrl);
  const displayedFrontSrc = frontPreviewUrl ?? frontExampleSrc;

  useEffect(() => {
    if (!frontFile) {
      setFrontPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(frontFile);
    setFrontPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [frontFile]);

  const handleNextOrStart = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!frontFile) {
      setFrontFileError(true);
      toast.error(t("measurePhoto.missingFront"));
      return;
    }

    if (requiresSideImage) {
      navigate("/measure/photos/side", {
        state: {
          ...flowState,
          frontFile,
        },
        replace: true,
      });
      return;
    }

    try {
      const output = await startPipeline({
        mode: flowState.mode,
        frontFile,
        heightCm: flowState.heightCm,
        weightKg: flowState.weightKg,
        gender: flowState.gender,
        measurementModel: flowState.measurementModel,
      });

      toast.success(t("measurePhoto.startSuccess", { jobId: output.upload.jobId }));
      navigate(`/measure/analyzing/${output.upload.jobId}`, {
        state: {
          measurementModel: flowState.measurementModel,
        },
        replace: true,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("measurePhoto.startError")));
    }
  };

  const genderLabel =
    flowState.gender === "male"
      ? t("measureInfo.male")
      : flowState.gender === "female"
        ? t("measureInfo.female")
        : t("measureInfo.other");

  return (
    <div className="font-['Inter',sans-serif] flex min-h-screen w-full items-center justify-center bg-background px-0">
      <div className="flex min-h-screen w-full max-w-[480px] flex-col border-x border-border bg-background text-foreground shadow-xl shadow-slate-300/40 lg:max-w-none lg:border-x-0 lg:shadow-none">
        <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                navigate("/measure/info", {
                  replace: true,
                  state: { measurementModel: flowState.measurementModel },
                })
              }
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 transition-colors hover:bg-slate-100"
              aria-label={t("common.back")}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="hidden text-xl font-bold tracking-tight sm:block">{t("common.appName")}</span>
          </div>

          <div className="mx-4 w-full max-w-md sm:mx-8">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[45%] rounded-full bg-primary" />
            </div>
          </div>

          <div className="w-10" />
        </header>

        <main className="relative flex flex-1 items-start justify-center px-4 pb-6 pt-2 sm:px-8 sm:pb-8 sm:pt-4">
          <div className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full bg-primary/10 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-12 -left-16 h-72 w-72 rounded-full bg-blue-200/15 blur-[90px]" />

          <div className="w-full max-w-[480px]">
            <Card className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10">
              <div className="mb-7 space-y-2 text-center sm:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("measurePhoto.title")}</h1>
                <p className="text-slate-500">
                  {requiresSideImage ? t("measurePhoto.subtitlePremiumFront") : t("measurePhoto.subtitleQuick")}
                </p>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                <div className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-center">
                  <p className="font-semibold">{t("measurePhoto.summaryGender")}</p>
                  <p className="mt-1 font-bold text-slate-900">{genderLabel}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-center">
                  <p className="font-semibold">{t("measurePhoto.summaryHeight")}</p>
                  <p className="mt-1 font-bold text-slate-900">{flowState.heightCm} cm</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-center">
                  <p className="font-semibold">{t("measurePhoto.summaryWeight")}</p>
                  <p className="mt-1 font-bold text-slate-900">
                    {flowState.weightKg ? `${flowState.weightKg} kg` : t("measureInfo.optional")}
                  </p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleNextOrStart}>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    {t("measurePhoto.frontLabel")}{" "}
                    <span className="text-xs font-medium text-primary">({t("measurePhoto.required")})</span>
                  </label>
                  <div className="rounded-2xl bg-[#EBF4FA]/65 p-3">
                    <p className="mb-2 px-1 text-xs font-semibold text-slate-500">{t("measurePhoto.frontExample")}</p>
                    {hasFrontPreview || isFrontExampleVisible ? (
                      <div className="mx-auto aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-xl bg-[#EBF4FA]/65">
                        <img
                          src={displayedFrontSrc}
                          alt={t("measurePhoto.frontExampleAlt")}
                          className="h-full w-full object-contain object-center"
                          loading="lazy"
                          onError={() => {
                            if (hasFrontPreview) {
                              return;
                            }
                            const hasNext = frontExampleIndex < FRONT_EXAMPLE_IMAGE_SOURCES.length - 1;
                            if (hasNext) {
                              setFrontExampleIndex((prev) => prev + 1);
                              return;
                            }
                            setIsFrontExampleVisible(false);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="mx-auto flex aspect-[3/4] w-full max-w-[260px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-4 text-center text-xs text-slate-500">
                        {t("measurePhoto.frontExampleMissing")}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-[#EBF4FA]/65 p-3">
                    <p className="text-xs font-bold text-slate-700">{t("measurePhoto.tipsTitle")}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-slate-600">
                      <li>{t("measurePhoto.tip1")}</li>
                      <li>{t("measurePhoto.tip2")}</li>
                      <li>{t("measurePhoto.tip3")}</li>
                      <li>{t("measurePhoto.tip4")}</li>
                    </ul>
                  </div>

                  <label className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                    <ImageUp className="h-4 w-4 text-primary" />
                    <span>{frontFile?.name ?? t("measurePhoto.attachPhoto")}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        setFrontFile(event.target.files?.[0] ?? null);
                        setFrontFileError(false);
                      }}
                    />
                  </label>
                  {frontFileError && (
                    <p className="pl-2 text-xs font-medium text-red-600">{t("measurePhoto.missingFront")}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!requiresSideImage && isPending}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-[#327ac2] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {!requiresSideImage && isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t("measurePhoto.starting")}</span>
                    </>
                  ) : (
                    <>
                      <span>{requiresSideImage ? t("measurePhoto.nextStep") : t("measurePhoto.startQuick")}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
