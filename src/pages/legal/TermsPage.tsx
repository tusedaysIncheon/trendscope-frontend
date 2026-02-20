import { Link } from "react-router-dom";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function TermsPage() {
  const { t } = useI18n();

  return (
    <div className="font-['Inter',sans-serif] min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col border-x border-border bg-background">
        <LandingHeader showCta={false} />
        <main className="flex-1 px-5 pb-10 pt-24 sm:px-8">
          <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{t("common.terms")}</h1>
              <p className="text-sm text-muted-foreground">최종 업데이트: 2026-02-20</p>
            </header>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">1. 서비스 이용</h2>
              <p>사용자는 관련 법령 및 본 약관을 준수하여 서비스를 이용해야 합니다.</p>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">2. 계정 및 보안</h2>
              <p>계정 관리 책임은 사용자에게 있으며, 무단 사용 발견 시 즉시 고객지원으로 알려야 합니다.</p>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">3. 금지 행위</h2>
              <p>불법 콘텐츠 업로드, 서비스 방해, 타인의 권리 침해 행위는 금지됩니다.</p>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">4. 문의</h2>
              <p>약관 관련 문의: support@trend-scope.net</p>
            </section>

            <div className="pt-2">
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
