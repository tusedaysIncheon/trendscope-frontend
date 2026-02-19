import { useNavigate } from "react-router-dom";
import { Crown, EyeOff, Ruler, ShieldCheck, Shirt, Sparkles, Zap } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LandingModelViewer } from "@/shared/components/LandingModelViewer";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { useAuthStore } from "@/store/useAuthStore";

export default function IndexPage() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isKorean = language === "ko";

  return (
    <div className="font-['Inter',sans-serif] flex min-h-screen w-full items-center justify-center bg-background px-0">
      <div className="flex min-h-screen w-full max-w-[480px] flex-col border-x border-border bg-background text-foreground shadow-xl shadow-slate-300/40 lg:max-w-none lg:border-x-0 lg:shadow-none">
        <LandingHeader
          ctaPath={isAuthenticated ? "/profile" : "/login"}
          ctaLabelKey={isAuthenticated ? "common.myPage" : "common.start"}
          enableTicketRouting={isAuthenticated}
        />

        <main className="flex flex-1 px-5 py-6 lg:px-10 lg:py-10">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-7 lg:grid lg:grid-cols-12 lg:gap-8">
            <section className="flex flex-col gap-5 lg:col-span-5 lg:pt-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-primary ring-1 ring-primary/20">
                <Sparkles className="h-4 w-4" />
                <p className="text-xs font-bold tracking-wide">{t("landing.badge")}</p>
              </div>

              <div className="space-y-3">
                <h1 className="text-[2.25rem] font-black leading-[1.08] tracking-tight sm:text-[2.7rem]">
                  <span className="inline-flex flex-wrap items-center gap-x-2 text-slate-900">
                    <span>{t("landing.titleLine1Before3d")}</span>
                    <span className="inline-flex h-[1.06em] items-center rounded-lg bg-primary px-2 text-white shadow-sm">
                      <span className="relative top-[2px] text-[0.9em] leading-none">3D</span>
                    </span>
                    <span>{t("landing.titleLine1After3d")}</span>
                  </span>
                  <span className="block text-slate-900">{t("landing.titleLine2")}</span>
                </h1>
                <p
                  className={`font-medium text-slate-600 ${
                    isKorean
                      ? "text-[13px] leading-[1.5] tracking-[-0.01em] sm:text-base sm:tracking-normal"
                      : "text-base leading-relaxed"
                  }`}
                >
                  <span className={`block ${isKorean ? "whitespace-nowrap" : ""}`}>{t("landing.subtitleLine1")}</span>
                  <span className={`block ${isKorean ? "whitespace-nowrap" : ""}`}>{t("landing.subtitleLine2")}</span>
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-[18px] w-[18px] text-green-500" />
                  <span>{t("landing.encrypted")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <EyeOff className="h-[18px] w-[18px] text-primary" />
                  <span>{t("landing.privateByDefault")}</span>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-4 lg:col-span-7">
              <Card className="gap-4 rounded-2xl border border-border p-4 shadow-xl shadow-slate-200/60">
                <LandingModelViewer />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <article className="rounded-xl border border-border bg-slate-50 p-3">
                    <div className="mb-2 inline-flex rounded-full bg-primary/10 p-1.5 text-primary">
                      <Ruler className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{t("landing.feature1Title")}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {t("landing.feature1Description")}
                    </p>
                  </article>

                  <article className="rounded-xl border border-border bg-slate-50 p-3">
                    <div className="mb-2 inline-flex rounded-full bg-primary/10 p-1.5 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{t("landing.feature2Title")}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {t("landing.feature2Description")}
                    </p>
                  </article>

                  <article className="rounded-xl border border-border bg-slate-50 p-3">
                    <div className="mb-2 inline-flex rounded-full bg-primary/10 p-1.5 text-primary">
                      <Shirt className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{t("landing.feature3Title")}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {t("landing.feature3Description")}
                    </p>
                  </article>
                </div>

                {isAuthenticated ? (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <h3 className="text-sm font-black text-slate-900">{t("landing.modeTitle")}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{t("landing.modeSubtitle")}</p>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <article className="relative rounded-xl border border-slate-200 bg-white p-3">
                        <p className="absolute right-3 top-3 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold leading-none text-primary">
                          {t("landing.quickTicketUseNotice")}
                        </p>
                        <div className="mb-2 inline-flex rounded-full bg-primary/10 p-1.5 text-primary">
                          <Zap className="h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{t("landing.quickTitle")}</h4>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{t("landing.quickDescription")}</p>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-600">
                          <li>{t("landing.quickScriptLine1")}</li>
                          <li>{t("landing.quickScriptLine2")}</li>
                        </ul>
                        <Button
                          className="mt-3 h-10 w-full rounded-lg text-xs font-bold"
                          onClick={() => navigate("/measure/info", { state: { measurementModel: "quick" } })}
                        >
                          {t("landing.quickCta")}
                        </Button>
                      </article>

                      <article className="relative rounded-xl border border-primary/25 bg-primary/[0.07] p-3">
                        <p className="absolute right-3 top-3 rounded-full bg-[#FA824C]/15 px-2 py-1 text-[10px] font-semibold leading-none text-[#C85E2D]">
                          {t("landing.premiumTicketUseNotice")}
                        </p>
                        <div className="mb-2 inline-flex rounded-full bg-white p-1.5 text-primary ring-1 ring-primary/20">
                          <Crown className="h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{t("landing.premiumTitle")}</h4>
                        <p className="mt-1 text-xs leading-relaxed text-slate-700">{t("landing.premiumDescription")}</p>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-700">
                          <li>{t("landing.premiumScriptLine1")}</li>
                          <li>{t("landing.premiumScriptLine2")}</li>
                        </ul>
                        <Button
                          className="mt-3 h-10 w-full rounded-lg bg-[#342E37] text-xs font-bold text-white shadow-md hover:bg-[#27222a]"
                          onClick={() => navigate("/measure/info", { state: { measurementModel: "premium" } })}
                        >
                          {t("landing.premiumCta")}
                        </Button>
                      </article>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl bg-[#342E37] p-4 text-white">
                      <h3 className="mb-2 text-sm font-bold">{t("landing.scriptTitle")}</h3>
                      <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-slate-100">
                        <li>{t("landing.scriptLine1")}</li>
                        <li>{t("landing.scriptLine2")}</li>
                        <li>{t("landing.scriptLine3")}</li>
                      </ul>
                    </div>

                    <Button
                      className="h-12 w-full items-center justify-center rounded-xl py-0 text-sm font-bold leading-none text-white shadow-lg shadow-primary/25"
                      onClick={() => navigate("/login")}
                    >
                      <span className="inline-block translate-y-[0.5px]">{t("common.start")}</span>
                    </Button>
                  </>
                )}
              </Card>
            </section>
          </div>
        </main>

        <footer className="mt-auto w-full border-t border-border py-6">
          <div className="mx-auto max-w-[1200px] px-5 text-center">
            <p className="text-xs text-slate-400">© 2026 Trendscope Inc.</p>
            <div className="mt-3 flex justify-center gap-4 text-xs text-slate-500">
              <a href="#" className="transition-colors hover:text-primary">
                {t("common.privacy")}
              </a>
              <a href="#" className="transition-colors hover:text-primary">
                {t("common.terms")}
              </a>
              <a href="#" className="transition-colors hover:text-primary">
                {t("common.help")}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
