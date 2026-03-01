import { Link } from "react-router-dom";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LEGAL_CONTENT } from "@/lib/i18n/legalContent";
import { withLanguagePrefix } from "@/lib/i18n/url";
import { SEO } from "@/shared/components/SEO";

export default function RefundPolicyPage() {
  const { t, language } = useI18n();
  const content = LEGAL_CONTENT[language].refund;

  return (
    <div className="font-['Inter',sans-serif] min-h-screen bg-background text-foreground">
      <SEO title="환불 및 결제 정책 - TrendScope" />
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col border-x border-border bg-background">
        <LandingHeader showCta={false} />
        <main className="flex-1 px-5 pb-10 pt-24 sm:px-8">
          <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{t("common.refundPolicy")}</h1>
              <p className="text-sm text-muted-foreground">{content.dateLabel}</p>
            </header>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section1Title}</h2>
              <p>{content.section1Paragraph}</p>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section2Title}</h2>
              <p>{content.section2Paragraph}</p>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section3Title}</h2>
              <p>{content.section3Paragraph}</p>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section4Title}</h2>
              <p>{content.section4Paragraph}</p>
            </section>

            <div className="pt-2">
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
