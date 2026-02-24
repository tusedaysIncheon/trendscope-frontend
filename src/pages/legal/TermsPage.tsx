import { Link } from "react-router-dom";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LEGAL_CONTENT } from "@/lib/i18n/legalContent";

export default function TermsPage() {
  const { t, language } = useI18n();
  const content = LEGAL_CONTENT[language].terms;

  return (
    <div className="font-['Inter',sans-serif] min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col border-x border-border bg-background">
        <LandingHeader showCta={false} />
        <main className="flex-1 px-5 pb-10 pt-24 sm:px-8">
          <article className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{t("common.terms")}</h1>
              <p className="text-sm text-muted-foreground">{content.dateLabel}</p>
            </header>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section1Title}</h2>
              <ul className="list-disc space-y-1 pl-5">
                {content.serviceItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section2Title}</h2>
              {content.section2Paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section3Title}</h2>
              <ul className="list-disc space-y-1 pl-5">
                {content.paymentBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section4Title}</h2>
              <ul className="list-disc space-y-1 pl-5">
                {content.section4Bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section5Title}</h2>
              {content.section5Paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section6Title}</h2>
              <ul className="list-disc space-y-1 pl-5">
                {content.prohibitedActs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>{content.section6Notice}</p>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section7Title}</h2>
              <p>{content.section7Paragraph}</p>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section8Title}</h2>
              <p>{content.contactText}</p>
            </section>

            <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
              <Link to="/open-source-notices" className="text-sm font-semibold text-primary hover:underline">
                {t("common.openSourceNotices")}
              </Link>
              <Link to="/" className="text-sm font-semibold text-primary hover:underline">
                {t("common.back")}
              </Link>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
