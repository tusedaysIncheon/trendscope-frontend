import { useI18n } from "@/lib/i18n/I18nProvider";
import { ModelGlbViewer } from "@/shared/components/ModelGlbViewer";

type LandingModelViewerProps = {
  modelSrc?: string;
};

export function LandingModelViewer({
  modelSrc = "/person_0.glb",
}: LandingModelViewerProps) {
  const { t } = useI18n();

  return (
    <div className="relative h-[340px] overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-[#1B1F2A] via-[#161A24] to-[#11141D]">
      <ModelGlbViewer
        src={modelSrc}
        autoRotate
        interactive={false}
        appearance="dark"
        cameraOrbit="0deg 76deg 3.9m"
        className="h-full w-full rounded-none border-0 pointer-events-none"
        emptyMessage={t("landing.modelLoading")}
        errorMessage={t("landing.modelLoading")}
      />

      <div className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-[11px] font-bold text-primary shadow-sm ring-1 ring-white/20">
        {t("landing.modelTitle")}
      </div>
      <div className="absolute inset-x-3 bottom-3 rounded-lg bg-black/55 px-3 py-2 text-[11px] font-medium text-slate-100 shadow-sm ring-1 ring-white/20">
        {t("landing.modelDescription")}
      </div>
    </div>
  );
}
