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
          <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{t("common.help")}</h1>
              <p className="text-sm text-muted-foreground">자주 묻는 질문과 문의 채널 안내</p>
            </header>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">자주 묻는 질문</h2>
              <div>
                <p className="font-semibold text-slate-900">Q. 어떤 사진을 업로드해야 하나요?</p>
                <p>A. 전신이 보이는 정면/측면 사진을 밝은 환경에서 촬영해 주세요.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Q. 측정 실패가 나옵니다.</p>
                <p>A. 배경이 단순하고 신체 윤곽이 잘 보이는 이미지로 다시 시도해 주세요.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Q. 결제/티켓 문의는 어디로 하나요?</p>
                <p>A. support@trend-scope.net 으로 주문 정보와 함께 문의해 주세요.</p>
              </div>
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
