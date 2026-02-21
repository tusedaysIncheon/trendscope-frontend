import { Link } from "react-router-dom";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function PrivacyPolicyPage() {
  const { t } = useI18n();

  const processingPurposes = [
    "회원 식별, 로그인 인증, 계정 및 세션 관리",
    "사진 기반 신체 측정 결과 및 3D 모델 생성/제공",
    "AI 스타일 추천 생성 및 이력 조회 제공",
    "결제 확인, 티켓 적립·차감·환불(복구) 처리",
    "장애 대응, 보안 모니터링, 부정 이용 방지",
  ];

  const collectedItems = [
    {
      title: "계정/인증 정보",
      description:
        "이메일 OTP 로그인 시 이메일과 OTP 해시값(원문 미저장), 소셜 로그인 시 제공자 식별값 및 이메일을 처리합니다.",
    },
    {
      title: "세션 정보",
      description:
        "액세스 토큰은 서버 저장 없이 검증에 사용하고, 리프레시 토큰은 Redis에 사용자·디바이스 기준으로 저장합니다.",
    },
    {
      title: "프로필 정보",
      description: "닉네임, 성별, 키, 몸무게를 저장하여 측정 및 추천 품질 개선에 사용합니다.",
    },
    {
      title: "측정 데이터",
      description:
        "정면/측면 이미지 키, 3D 모델(GLB) 키, 측정 결과 JSON, 상태/오류 정보, 모드(Quick/Premium)를 처리합니다.",
    },
    {
      title: "결제/티켓 데이터",
      description: "결제 식별 정보, 티켓 유형·수량, 티켓 원장 이력(HOLD/CONSUME/RELEASE 등)을 처리합니다.",
    },
    {
      title: "운영 로그",
      description: "요청 IP, URL, 예외 메시지 등 서비스 안정성 확보를 위한 최소 로그를 수집합니다.",
    },
  ];

  const retentionRows = [
    ["OTP 해시", "기본 300초", "만료 또는 인증 완료 시 삭제"],
    ["OTP 요청 쿨다운", "기본 60초", "시간 경과 후 자동 삭제"],
    ["OTP 시도 횟수", "최대 5회", "초과 시 OTP 무효화"],
    ["리프레시 토큰", "환경설정 TTL", "로그아웃/탈퇴 시 즉시 삭제"],
    ["업로드 URL", "기본 10분", "만료 후 사용 불가"],
    ["다운로드 URL", "기본 30분", "만료 후 사용 불가"],
    ["공유 토큰", "기본 72시간", "만료 후 접근 불가"],
    ["촬영 이미지", "기본 1일", "스케줄러가 S3 객체 삭제 + DB 키 제거"],
    ["3D 모델/분석 기록", "기본 365일", "스케줄러가 S3 객체 삭제 + DB 행 삭제"],
  ];

  const processors = [
    ["AWS(S3/SES)", "이미지·3D 파일 저장, 이메일 발송"],
    ["Redis", "OTP 상태, 세션 토큰 저장"],
    ["Modal", "신체 측정 파이프라인 실행"],
    ["OpenAI", "스타일 추천 생성"],
    ["Creem", "결제 처리 및 결제 상태 확인"],
    ["Google/Naver/Kakao", "소셜 로그인 인증"],
  ];

  return (
    <div className="font-['Inter',sans-serif] min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col border-x border-border bg-background">
        <LandingHeader showCta={false} />
        <main className="flex-1 px-5 pb-10 pt-24 sm:px-8">
          <article className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{t("common.privacy")}</h1>
              <p className="text-sm text-muted-foreground">시행일자: 2026-02-22 · 최종 업데이트: 2026-02-22</p>
            </header>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">1. 개인정보 처리 목적</h2>
              <ul className="list-disc space-y-1 pl-5">
                {processingPurposes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">2. 수집 항목</h2>
              <div className="space-y-3">
                {collectedItems.map((item) => (
                  <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">3. 보유 및 이용 기간</h2>
              <p>아래 기간은 기본 운영 설정값이며, 법령 또는 운영 정책 변경 시 조정될 수 있습니다.</p>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 font-semibold">항목</th>
                      <th className="px-3 py-2 font-semibold">보유 기간</th>
                      <th className="px-3 py-2 font-semibold">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retentionRows.map(([item, period, note]) => (
                      <tr key={item} className="border-t border-slate-200">
                        <td className="px-3 py-2 text-slate-900">{item}</td>
                        <td className="px-3 py-2">{period}</td>
                        <td className="px-3 py-2">{note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">4. 처리 위탁 및 외부 연동</h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 font-semibold">수탁/연동 서비스</th>
                      <th className="px-3 py-2 font-semibold">처리 목적</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processors.map(([name, purpose]) => (
                      <tr key={name} className="border-t border-slate-200">
                        <td className="px-3 py-2 text-slate-900">{name}</td>
                        <td className="px-3 py-2">{purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>회사는 법령상 근거 또는 이용자 동의가 있는 경우를 제외하고 개인정보를 임의로 제3자에게 제공하지 않습니다.</p>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">5. 파기 및 안전성 확보 조치</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>보유기간 경과 또는 목적 달성 시 지체 없이 파기합니다.</li>
                <li>전자파일은 복구가 어려운 방식으로 삭제하며, S3 객체는 삭제 후 DB 참조를 정리합니다.</li>
                <li>JWT 기반 인증, 역할 기반 인가, OTP 시도 제한, 결제 웹훅 서명 검증을 적용합니다.</li>
                <li>리프레시 토큰은 HttpOnly 쿠키 및 Redis 저장소를 통해 관리합니다.</li>
              </ul>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">6. 이용자 권리 및 문의</h2>
              <p>
                이용자는 개인정보 열람·정정·삭제·처리정지를 요청할 수 있으며, 요청은 고객지원 채널로 접수할 수 있습니다.
              </p>
              <p>개인정보 문의: support@trend-scope.net</p>
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
