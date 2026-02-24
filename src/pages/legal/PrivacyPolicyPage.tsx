import { Link } from "react-router-dom";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LEGAL_CONTENT } from "@/lib/i18n/legalContent";
import { SEO } from "@/shared/components/SEO";

export default function PrivacyPolicyPage() {
  const { t, language } = useI18n();
  const content = LEGAL_CONTENT[language].privacy;
  const [retentionItemHeader, retentionPeriodHeader, retentionNoteHeader] =
    content.retentionTableHeaders;
  const [processorNameHeader, processorPurposeHeader] = content.processorTableHeaders;

  return (
    <div className="font-['Inter',sans-serif] min-h-screen bg-background text-foreground">
      <SEO title="개인정보처리방침 - TrendScope" />
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col border-x border-border bg-background">
        <LandingHeader showCta={false} />
        <main className="flex-1 px-5 pb-10 pt-24 sm:px-8">
          <article className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{t("common.privacy")}</h1>
              <p className="text-sm text-muted-foreground">{content.dateLabel}</p>
            </header>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section1Title}</h2>
              <ul className="list-disc space-y-1 pl-5">
                {content.processingPurposes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section2Title}</h2>
              <div className="space-y-3">
                {content.collectedItems.map((item) => (
                  <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section3Title}</h2>
              <p>{content.section3Description}</p>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 font-semibold">{retentionItemHeader}</th>
                      <th className="px-3 py-2 font-semibold">{retentionPeriodHeader}</th>
                      <th className="px-3 py-2 font-semibold">{retentionNoteHeader}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.retentionRows.map(([name, period, note]) => (
                      <tr key={name} className="border-t border-slate-200">
                        <td className="px-3 py-2 text-slate-900">{name}</td>
                        <td className="px-3 py-2">{period}</td>
                        <td className="px-3 py-2">{note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section4Title}</h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 font-semibold">{processorNameHeader}</th>
                      <th className="px-3 py-2 font-semibold">{processorPurposeHeader}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.processors.map(([name, purpose]) => (
                      <tr key={name} className="border-t border-slate-200">
                        <td className="px-3 py-2 text-slate-900">{name}</td>
                        <td className="px-3 py-2">{purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>{content.section4Notice}</p>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section5Title}</h2>
              <ul className="list-disc space-y-1 pl-5">
                {content.securityBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section6Title}</h2>
              <p>{content.section6Description}</p>
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
