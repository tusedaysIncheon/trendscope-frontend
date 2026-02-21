import { Link } from "react-router-dom";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";

type NoticeItem = {
  name: string;
  provider: string;
  purpose: string;
  license: string;
  link?: string;
};

export default function OpenSourceNoticesPage() {
  const ai3dItems: NoticeItem[] = [
    {
      name: "SAM 3D Body",
      provider: "Meta Platforms, Inc.",
      purpose: "사진 기반 3D 신체 메시 복원",
      license: "SAM License",
      link: "https://github.com/facebookresearch/sam-3d-body",
    },
    {
      name: "Momentum Human Rig (MHR)",
      provider: "Meta Platforms, Inc.",
      purpose: "3D 인체 파라메트릭 메시 모델",
      license: "SAM License",
      link: "https://github.com/facebookresearch/sam-3d-body/blob/main/LICENSE",
    },
    {
      name: "trimesh",
      provider: "Michael Dawson-Haggerty",
      purpose: "3D 메시 처리 및 GLB 변환",
      license: "MIT License",
      link: "https://github.com/mikedh/trimesh",
    },
    {
      name: "OpenAI API",
      provider: "OpenAI, Inc.",
      purpose: "측정 결과 기반 스타일 추천 생성",
      license: "OpenAI Terms of Use",
      link: "https://openai.com/policies/terms-of-use",
    },
  ];

  const serviceItems: NoticeItem[] = [
    {
      name: "React",
      provider: "Meta Platforms, Inc.",
      purpose: "프론트엔드 UI 구축",
      license: "MIT License",
      link: "https://github.com/facebook/react",
    },
    {
      name: "Spring Boot",
      provider: "VMware, Inc.",
      purpose: "백엔드 애플리케이션 프레임워크",
      license: "Apache License 2.0",
      link: "https://github.com/spring-projects/spring-boot",
    },
    {
      name: "PostgreSQL",
      provider: "PostgreSQL Global Development Group",
      purpose: "관계형 데이터베이스",
      license: "PostgreSQL License",
      link: "https://www.postgresql.org/about/licence/",
    },
    {
      name: "Redis",
      provider: "Redis Ltd.",
      purpose: "인메모리 캐시/세션 저장소",
      license: "버전별 상이(BSD/RSAL/SSPL/AGPL)",
      link: "https://redis.io/legal/licenses/",
    },
  ];

  const infraItems: NoticeItem[] = [
    {
      name: "Amazon Web Services",
      provider: "Amazon Web Services, Inc.",
      purpose: "S3 파일 저장, SES 이메일 발송",
      license: "AWS Customer Agreement",
      link: "https://aws.amazon.com/agreement/",
    },
    {
      name: "Modal",
      provider: "Modal Labs, Inc.",
      purpose: "AI 분석 파이프라인 실행",
      license: "Modal Terms of Service",
      link: "https://modal.com/legal/terms",
    },
    {
      name: "Creem",
      provider: "Creem",
      purpose: "결제 처리(Merchant of Record)",
      license: "Creem Terms",
      link: "https://www.creem.io/terms",
    },
  ];

  const socialItems: NoticeItem[] = [
    {
      name: "Google Identity Services",
      provider: "Google LLC",
      purpose: "Google OAuth 로그인",
      license: "Google APIs Terms",
      link: "https://developers.google.com/terms",
    },
    {
      name: "Naver Login",
      provider: "NAVER Corp.",
      purpose: "Naver OAuth 로그인",
      license: "네이버 개발자 이용약관",
      link: "https://developers.naver.com/terms/terms.html",
    },
    {
      name: "Kakao Login",
      provider: "Kakao Corp.",
      purpose: "Kakao OAuth 로그인",
      license: "Kakao Developers 이용약관",
      link: "https://developers.kakao.com/terms",
    },
  ];

  const renderTable = (items: NoticeItem[]) => (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-3 py-2 font-semibold">기술/서비스</th>
            <th className="px-3 py-2 font-semibold">제공자</th>
            <th className="px-3 py-2 font-semibold">용도</th>
            <th className="px-3 py-2 font-semibold">라이선스/약관</th>
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
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col border-x border-border bg-background">
        <LandingHeader showCta={false} />
        <main className="flex-1 px-5 pb-10 pt-24 sm:px-8">
          <article className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">오픈소스 및 제3자 소프트웨어 고지</h1>
              <p className="text-sm text-muted-foreground">최종 업데이트: 2026-02-22</p>
            </header>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">1. AI 및 3D 모델링</h2>
              {renderTable(ai3dItems)}
              <p>
                본 서비스는 Meta Platforms, Inc.가 공개한 SAM 3D Body 계열 기술을 활용합니다. 해당 기술의 권리와 라이선스는
                각 제공자에게 귀속되며, TRENDSCOPE는 독립 서비스입니다.
              </p>
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">2. 프론트엔드/백엔드/데이터 저장소</h2>
              {renderTable(serviceItems)}
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">3. 인프라 및 결제</h2>
              {renderTable(infraItems)}
            </section>

            <section className="space-y-3 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">4. 소셜 로그인 연동</h2>
              {renderTable(socialItems)}
            </section>

            <section className="space-y-2 text-sm leading-7 text-slate-700">
              <h2 className="text-base font-bold text-slate-900">5. 문의</h2>
              <p>오픈소스/라이선스 고지 문의: support@trend-scope.net</p>
            </section>

            <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
              <Link to="/privacy" className="text-sm font-semibold text-primary hover:underline">
                개인정보처리방침
              </Link>
              <Link to="/terms" className="text-sm font-semibold text-primary hover:underline">
                이용약관
              </Link>
              <Link to="/" className="text-sm font-semibold text-primary hover:underline">
                홈으로
              </Link>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
