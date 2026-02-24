import { Link } from "react-router-dom";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LEGAL_CONTENT } from "@/lib/i18n/legalContent";
import { SEO } from "@/shared/components/SEO";

type NoticeItem = {
  name: string;
  provider: string;
  purpose: string;
  license: string;
  link?: string;
};

export default function OpenSourceNoticesPage() {
  const { t, language } = useI18n();
  const content = LEGAL_CONTENT[language].openSource;
  const [serviceHeader, providerHeader, purposeHeader, licenseHeader] =
    content.tableHeaders;

  const renderTable = (items: NoticeItem[]) => (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-3 py-2 font-semibold">{serviceHeader}</th>
            <th className="px-3 py-2 font-semibold">{providerHeader}</th>
            <th className="px-3 py-2 font-semibold">{purposeHeader}</th>
            <th className="px-3 py-2 font-semibold">{licenseHeader}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name} className="border-t border-slate-200">
              <td className="px-3 py-2 text-slate-900">{item.name}</td>
              <td className="px-3 py-2">{item.provider}</td>
              <td className="px-3 py-2">{item.purpose}</td>
              <td className="px-3 py-2">
                {item.link ? (
                  <a className="text-primary hover:underline" href={item.link} target="_blank" rel="noreferrer">
                    {item.license}
                  </a>
                ) : (
                  item.license
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="font-['Inter',sans-serif] min-h-screen bg-background text-foreground">
      <SEO title="오픈소스 고지 - TrendScope" />
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col border-x border-border bg-background">
        <LandingHeader showCta={false} />
        <main className="flex-1 px-5 pb-10 pt-24 sm:px-8">
          <article className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{content.title}</h1>
              <p className="text-sm text-muted-foreground">{content.dateLabel}</p>
            </header>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section1Title}</h2>
              {renderTable(content.ai3dItems)}
              <p>{content.section1Paragraph}</p>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section2Title}</h2>
              {renderTable(content.serviceItems)}
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section3Title}</h2>
              {renderTable(content.infraItems)}
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section4Title}</h2>
              {renderTable(content.socialItems)}
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">{content.section5Title}</h2>
              <p>{content.section5Paragraph}</p>
            </section>

            <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
              <Link to="/privacy" className="text-sm font-semibold text-primary hover:underline">
                {t("common.privacy")}
              </Link>
              <Link to="/terms" className="text-sm font-semibold text-primary hover:underline">
                {t("common.terms")}
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
