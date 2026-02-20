import { Link } from "react-router-dom";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function PrivacyPolicyPage() {
  const { t } = useI18n();

  return (
    <div className="font-['Inter',sans-serif] min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col border-x border-border bg-background">
        <LandingHeader showCta={false} />
        <main className="flex-1 px-5 pb-10 pt-24 sm:px-8">
          <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{t("common.privacy")}</h1>
              <p className="text-sm text-muted-foreground">최종 업데이트: 2026-02-20</p>
            </header>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">1. 수집하는 정보</h2>
              <p>서비스 제공을 위해 계정 정보, 측정 입력 정보, 업로드 이미지, 사용 로그를 수집할 수 있습니다.</p>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">2. 이용 목적</h2>
              <p>회원 인증, 3D 측정 결과 생성, 고객지원, 서비스 품질 개선 및 보안 대응에 사용됩니다.</p>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">3. 보관 기간</h2>
              <p>법령 보관 의무가 없는 정보는 목적 달성 시 지체 없이 파기합니다.</p>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">4. 문의</h2>
              <p>개인정보 관련 문의: support@trend-scope.net</p>
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
