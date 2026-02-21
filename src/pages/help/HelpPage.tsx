import { Link } from "react-router-dom";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function HelpPage() {
  const { t } = useI18n();

  return (
    <div className="font-['Inter',sans-serif] min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col border-x border-border bg-background">
        <LandingHeader showCta={false} />
        <main className="flex-1 px-5 pb-10 pt-24 sm:px-8">
          <article className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{t("common.help")}</h1>
              <p className="text-sm text-muted-foreground">자주 묻는 질문 · 운영 정책 · 문의 채널 안내</p>
            </header>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">1. 시작 가이드</h2>
              <ol className="list-decimal space-y-1 pl-5">
                <li>로그인(이메일 OTP 또는 소셜 로그인)</li>
                <li>프로필 정보 입력(성별/키/몸무게/닉네임)</li>
                <li>측정 모드 선택(Quick/Premium)</li>
                <li>정면/측면 전신 사진 업로드</li>
                <li>분석 완료 후 결과·추천 확인</li>
              </ol>
            </section>

            <section className="space-y-4 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">2. 자주 묻는 질문</h2>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">Q. OTP 메일이 오지 않아요.</p>
                <p>A. 스팸함 확인 후 다시 요청해 주세요. OTP 재요청은 기본 60초 쿨다운이 적용됩니다.</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">Q. 측정이 실패합니다.</p>
                <p>A. 조명/해상도/자세/배경을 점검하고, 신체 윤곽이 잘 보이는 전신 사진으로 다시 시도해 주세요.</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">Q. 결제했는데 티켓이 안 들어왔어요.</p>
                <p>A. 결제 웹훅 처리 지연이 있을 수 있습니다. 주문 식별자와 함께 support 메일로 문의해 주세요.</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">Q. 공유 링크가 열리지 않아요.</p>
                <p>A. 공유 토큰 만료(기본 72시간) 또는 링크 손상일 수 있습니다. 새 링크를 생성해 주세요.</p>
              </div>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">3. 정책 바로가기</h2>
              <div className="flex flex-wrap gap-3">
                <Link to="/privacy" className="text-sm font-semibold text-primary hover:underline">
                  개인정보처리방침
                </Link>
                <Link to="/terms" className="text-sm font-semibold text-primary hover:underline">
                  이용약관
                </Link>
                <Link to="/refund-policy" className="text-sm font-semibold text-primary hover:underline">
                  환불/결제 정책
                </Link>
                <Link to="/open-source-notices" className="text-sm font-semibold text-primary hover:underline">
                  오픈소스 고지
                </Link>
              </div>
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">4. 문의 채널</h2>
              <p>일반/계정/결제/환불/개인정보 문의: support@trend-scope.net</p>
            </section>

            <div className="border-t border-slate-100 pt-3">
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
