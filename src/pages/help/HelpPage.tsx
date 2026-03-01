import { Link } from "react-router-dom";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { SEO } from "@/shared/components/SEO";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LEGAL_CONTENT } from "@/lib/i18n/legalContent";
import { withLanguagePrefix } from "@/lib/i18n/url";

export default function HelpPage() {
  const { t, language } = useI18n();
  const content = LEGAL_CONTENT[language].help;

  return (
    <div className="font-['Inter',sans-serif] min-h-screen bg-background text-foreground">
      <SEO
        title="도움말 및 고객센터 - TrendScope"
        description="TrendScope 3D 체형 분석 서비스 이용 방법과 자주 묻는 질문을 확인하세요."
      />
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col border-x border-border bg-background">
        <LandingHeader showCta={false} />
        <main className="flex-1 px-5 pb-10 pt-24 sm:px-8">
          <article className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{t("common.help")}</h1>
              <p className="text-sm text-muted-foreground">{content.subtitle}</p>
            </header>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section1Title}</h2>
              <ol className="list-decimal space-y-1 pl-5">
                {content.startGuideSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            <section className="space-y-4 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section2Title}</h2>
              {content.faqs.map((faq) => (
                <div key={faq.q} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">{faq.q}</p>
                  <p>{faq.a}</p>
                </div>
              ))}
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section3Title}</h2>
              <div className="flex flex-wrap gap-3">
                <Link to={withLanguagePrefix("/privacy", language)} className="text-sm font-semibold text-primary hover:underline">
                  {t("common.privacy")}
                </Link>
                <Link to={withLanguagePrefix("/terms", language)} className="text-sm font-semibold text-primary hover:underline">
                  {t("common.terms")}
                </Link>
                <Link to={withLanguagePrefix("/refund-policy", language)} className="text-sm font-semibold text-primary hover:underline">
                  {t("common.refundPolicy")}
                </Link>
                <Link to={withLanguagePrefix("/open-source-notices", language)} className="text-sm font-semibold text-primary hover:underline">
                  {t("common.openSourceNotices")}
                </Link>
              </div>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section4Title}</h2>
              <p>{content.contactText}</p>
            </section>

            <div className="border-t border-slate-100 pt-3">
              <Link to={withLanguagePrefix("/", language)} className="text-sm font-semibold text-primary hover:underline">
                {t("common.back")}
              </Link>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
