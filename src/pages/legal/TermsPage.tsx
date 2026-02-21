import { Link } from "react-router-dom";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function TermsPage() {
  const { t } = useI18n();

  const serviceItems = [
    "사진 기반 신체 측정(Quick/Premium)",
    "측정 결과 기반 3D 모델 생성 및 제공",
    "측정 결과 기반 AI 스타일 추천",
    "공유 링크를 통한 결과 페이지 공유",
  ];

  const prohibitedActs = [
    "타인 계정 또는 개인정보 도용",
    "타인의 사진을 무단 업로드하거나 불법 이미지를 등록하는 행위",
    "비정상 자동화 요청, 보안 우회, 서비스 운영 방해",
    "법령 또는 본 약관에 위반되는 행위",
  ];

  return (
    <div className="font-['Inter',sans-serif] min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col border-x border-border bg-background">
        <LandingHeader showCta={false} />
        <main className="flex-1 px-5 pb-10 pt-24 sm:px-8">
          <article className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{t("common.terms")}</h1>
              <p className="text-sm text-muted-foreground">시행일자: 2026-02-22 · 최종 업데이트: 2026-02-22</p>
            </header>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">1. 서비스 범위</h2>
              <ul className="list-disc space-y-1 pl-5">
                {serviceItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">2. 계정 및 인증</h2>
              <p>이용자는 이메일 OTP 또는 소셜 로그인으로 가입/로그인할 수 있으며, 계정 관리 책임은 이용자 본인에게 있습니다.</p>
              <p>계정의 무단 사용 또는 보안 이상을 인지한 경우 즉시 고객지원으로 통지해야 합니다.</p>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">3. 결제 및 티켓</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>측정 서비스 이용에는 모드(Quick/Premium)별 티켓이 필요합니다.</li>
                <li>결제 완료 확인 후 티켓이 계정에 적립됩니다.</li>
                <li>측정 요청 시 HOLD, 성공 시 CONSUME, 실패 시 RELEASE 로직이 적용됩니다.</li>
                <li>환불/복구 기준은 별도 환불·결제 정책 페이지를 따릅니다.</li>
              </ul>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">4. 결과 정확도 및 면책</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>측정 결과는 촬영 자세, 조명, 배경, 의복, 해상도에 따라 오차가 발생할 수 있습니다.</li>
                <li>서비스에서 제공하는 측정/추천 결과는 참고 정보이며, 절대적 정확성을 보장하지 않습니다.</li>
                <li>본 서비스는 의료행위 또는 전문 자격사의 판단을 대체하지 않습니다.</li>
              </ul>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">5. 공유 링크</h2>
              <p>공유 링크는 토큰을 보유한 누구나 접근 가능한 URL이며, 기본적으로 72시간 후 만료됩니다.</p>
              <p>이용자는 링크 전달로 발생할 수 있는 정보 노출 가능성을 이해하고 신중히 공유해야 합니다.</p>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">6. 금지 행위 및 이용 제한</h2>
              <ul className="list-disc space-y-1 pl-5">
                {prohibitedActs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>회사는 위반 행위 확인 시 사전 통지 후 서비스 이용 제한 또는 계정 조치를 할 수 있습니다.</p>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">7. 서비스 변경 및 중단</h2>
              <p>
                시스템 점검, 외부 연동 서비스(결제/메일/AI 추론) 장애, 불가항력 사유로 서비스 일부가 변경·중단될 수 있습니다.
              </p>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">8. 문의</h2>
              <p>약관 관련 문의: support@trend-scope.net</p>
            </section>

            <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
              <Link to="/open-source-notices" className="text-sm font-semibold text-primary hover:underline">
                오픈소스 고지 보기
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
