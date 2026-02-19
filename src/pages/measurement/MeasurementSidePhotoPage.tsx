import { ArrowLeft, ArrowRight, ImageUp, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAnalyzePipelineMutation } from "@/features/analyze/hooks/useAnalyze";
import { getApiErrorMessage } from "@/lib/api/error";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Card } from "@/shared/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import type { MeasureFlowState, MeasureFrontPhotoState } from "./types";

function isFileLike(value: unknown): value is File {
  return (
    !!value &&
    typeof value === "object" &&
    "name" in value &&
    "size" in value &&
    "type" in value
  );
}

function isMeasureFrontPhotoState(value: unknown): value is MeasureFrontPhotoState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<MeasureFlowState & { frontFile: unknown }>;
  const validModel = candidate.measurementModel === "premium";
  const validMode = candidate.mode === "STANDARD_2VIEW";
  const validGender =
    candidate.gender === "female" || candidate.gender === "male" || candidate.gender === "other";
  const hasHeight = typeof candidate.heightCm === "number";
  const hasFrontFile = isFileLike(candidate.frontFile);

  return validModel && validMode && validGender && hasHeight && hasFrontFile;
}

export default function MeasurementSidePhotoPage() {
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

  const flowState = useMemo<MeasureFrontPhotoState | null>(() => {
    const state = location.state;
    return isMeasureFrontPhotoState(state) ? state : null;
  }, [location.state]);

  useEffect(() => {
    if (!flowState) {
      navigate("/measure/photos", { replace: true });
    }
  }, [flowState, navigate]);

  const [sideFile, setSideFile] = useState<File | null>(null);
  const [sidePreviewUrl, setSidePreviewUrl] = useState<string | null>(null);
  const [sideFileError, setSideFileError] = useState(false);
  const [isSideExampleVisible, setIsSideExampleVisible] = useState(true);
  const [sideExampleIndex, setSideExampleIndex] = useState(0);

  useEffect(() => {
    if (!sideFile) {
      setSidePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(sideFile);
    setSidePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [sideFile]);

  if (!flowState) {
    return null;
  }

  const SIDE_EXAMPLE_IMAGE_SOURCES = ["/side-example.png"];
  const sideExampleSrc = SIDE_EXAMPLE_IMAGE_SOURCES[Math.min(sideExampleIndex, SIDE_EXAMPLE_IMAGE_SOURCES.length - 1)];
  const hasSidePreview = Boolean(sidePreviewUrl);
  const displayedSideSrc = sidePreviewUrl ?? sideExampleSrc;

  const handleStartPremium = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!sideFile) {
      setSideFileError(true);
      toast.error(t("measurePhoto.missingSide"));
      return;
    }

    try {
      const output = await startPipeline({
        mode: flowState.mode,
        frontFile: flowState.frontFile,
        sideFile,
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
                navigate("/measure/photos", {
                  replace: true,
                  state: flowState,
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
              <div className="h-full w-[75%] rounded-full bg-primary" />
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
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("measurePhoto.sidePageTitle")}</h1>
                <p className="text-slate-500">{t("measurePhoto.subtitlePremiumSide")}</p>
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

              <form className="space-y-5" onSubmit={handleStartPremium}>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    {t("measurePhoto.sideLabel")}{" "}
                    <span className="text-xs font-medium text-primary">({t("measurePhoto.required")})</span>
                  </label>
                  <div className="rounded-2xl bg-[#EBF4FA]/65 p-3">
                    <p className="mb-2 px-1 text-xs font-semibold text-slate-500">{t("measurePhoto.sideExample")}</p>
                    {hasSidePreview || isSideExampleVisible ? (
                      <div className="mx-auto aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-xl bg-[#EBF4FA]/65">
                        <img
                          src={displayedSideSrc}
                          alt={t("measurePhoto.sideExampleAlt")}
                          className="h-full w-full object-contain object-center"
                          loading="lazy"
                          onError={() => {
                            if (hasSidePreview) {
                              return;
                            }
                            const hasNext = sideExampleIndex < SIDE_EXAMPLE_IMAGE_SOURCES.length - 1;
                            if (hasNext) {
                              setSideExampleIndex((prev) => prev + 1);
                              return;
                            }
                            setIsSideExampleVisible(false);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="mx-auto flex aspect-[3/4] w-full max-w-[260px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-4 text-center text-xs text-slate-500">
                        {t("measurePhoto.sideExampleMissing")}
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
                    <span>{sideFile?.name ?? t("measurePhoto.attachPhoto")}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        setSideFile(event.target.files?.[0] ?? null);
                        setSideFileError(false);
                      }}
                    />
                  </label>
                  {sideFileError && (
                    <p className="pl-2 text-xs font-medium text-red-600">{t("measurePhoto.missingSide")}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-[#327ac2] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t("measurePhoto.starting")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("measurePhoto.startPremium")}</span>
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
