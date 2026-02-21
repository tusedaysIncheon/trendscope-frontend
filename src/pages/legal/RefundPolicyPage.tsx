import { Link } from "react-router-dom";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function RefundPolicyPage() {
  const { t } = useI18n();

  return (
    <div className="font-['Inter',sans-serif] min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col border-x border-border bg-background">
        <LandingHeader showCta={false} />
        <main className="flex-1 px-5 pb-10 pt-24 sm:px-8">
          <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{t("common.refundPolicy")}</h1>
              <p className="text-sm text-muted-foreground">최종 업데이트: 2026-02-21</p>
            </header>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">1. 결제 방식</h2>
              <p>본 서비스의 티켓 결제는 외부 결제대행사(Creem)를 통해 처리되며, 카드 정보는 당사 서버에 저장되지 않습니다.</p>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">2. 티켓 지급 시점</h2>
              <p>결제 완료 웹훅이 정상 수신되면 계정에 티켓이 자동 적립됩니다. 중복 웹훅은 멱등 처리됩니다.</p>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">3. 환불 원칙</h2>
              <p>측정 실패 등 서비스 사유가 확인되면 미사용 또는 실패 건에 대해 티켓 환불(복구) 처리가 가능합니다. 이미 정상 사용된 티켓은 환불 대상에서 제외될 수 있습니다.</p>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">4. 문의</h2>
              <p>결제/환불 문의: support@trend-scope.net</p>
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
