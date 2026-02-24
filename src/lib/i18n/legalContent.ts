import type { Language } from "./translations";

type CollectedItem = {
  title: string;
  description: string;
};

type NoticeItem = {
  name: string;
  provider: string;
  purpose: string;
  license: string;
  link?: string;
};

type LegalContent = {
  help: {
    subtitle: string;
    section1Title: string;
    startGuideSteps: string[];
    section2Title: string;
    faqs: Array<{ q: string; a: string }>;
    section3Title: string;
    section4Title: string;
    contactText: string;
  };
  privacy: {
    dateLabel: string;
    section1Title: string;
    processingPurposes: string[];
    section2Title: string;
    collectedItems: CollectedItem[];
    section3Title: string;
    section3Description: string;
    retentionTableHeaders: [string, string, string];
    retentionRows: [string, string, string][];
    section4Title: string;
    processorTableHeaders: [string, string];
    processors: [string, string][];
    section4Notice: string;
    section5Title: string;
    securityBullets: string[];
    section6Title: string;
    section6Description: string;
    contactText: string;
  };
  terms: {
    dateLabel: string;
    section1Title: string;
    serviceItems: string[];
    section2Title: string;
    section2Paragraphs: string[];
    section3Title: string;
    paymentBullets: string[];
    section4Title: string;
    section4Bullets: string[];
    section5Title: string;
    section5Paragraphs: string[];
    section6Title: string;
    prohibitedActs: string[];
    section6Notice: string;
    section7Title: string;
    section7Paragraph: string;
    section8Title: string;
    contactText: string;
  };
  refund: {
    dateLabel: string;
    section1Title: string;
    section1Paragraph: string;
    section2Title: string;
    section2Paragraph: string;
    section3Title: string;
    section3Paragraph: string;
    section4Title: string;
    section4Paragraph: string;
  };
  openSource: {
    title: string;
    dateLabel: string;
    tableHeaders: [string, string, string, string];
    section1Title: string;
    section1Paragraph: string;
    section2Title: string;
    section3Title: string;
    section4Title: string;
    section5Title: string;
    section5Paragraph: string;
    ai3dItems: NoticeItem[];
    serviceItems: NoticeItem[];
    infraItems: NoticeItem[];
    socialItems: NoticeItem[];
  };
};

export const LEGAL_CONTENT: Record<Language, LegalContent> = {
  ko: {
    help: {
      subtitle: "자주 묻는 질문 · 운영 정책 · 문의 채널 안내",
      section1Title: "1. 시작 가이드",
      startGuideSteps: [
        "로그인(이메일 OTP 또는 소셜 로그인)",
        "프로필 정보 입력(성별/키/몸무게/닉네임)",
        "측정 모드 선택(Quick/Premium)",
        "정면/측면 전신 사진 업로드",
        "분석 완료 후 결과·추천 확인",
      ],
      section2Title: "2. 자주 묻는 질문",
      faqs: [
        {
          q: "Q. OTP 메일이 오지 않아요.",
          a: "A. 스팸함 확인 후 다시 요청해 주세요. OTP 재요청은 기본 60초 쿨다운이 적용됩니다.",
        },
        {
          q: "Q. 측정이 실패합니다.",
          a: "A. 조명/해상도/자세/배경을 점검하고, 신체 윤곽이 잘 보이는 전신 사진으로 다시 시도해 주세요.",
        },
        {
          q: "Q. 결제했는데 티켓이 안 들어왔어요.",
          a: "A. 결제 웹훅 처리 지연이 있을 수 있습니다. 주문 식별자와 함께 support 메일로 문의해 주세요.",
        },
        {
          q: "Q. 공유 링크가 열리지 않아요.",
          a: "A. 공유 토큰 만료(기본 72시간) 또는 링크 손상일 수 있습니다. 새 링크를 생성해 주세요.",
        },
      ],
      section3Title: "3. 정책 바로가기",
      section4Title: "4. 문의 채널",
      contactText: "일반/계정/결제/환불/개인정보 문의: support@trend-scope.net",
    },
    privacy: {
      dateLabel: "시행일자: 2026-02-22 · 최종 업데이트: 2026-02-22",
      section1Title: "1. 개인정보 처리 목적",
      processingPurposes: [
        "회원 식별, 로그인 인증, 계정 및 세션 관리",
        "사진 기반 신체 측정 결과 및 3D 모델 생성/제공",
        "AI 스타일 추천 생성 및 이력 조회 제공",
        "결제 확인, 티켓 적립·차감·환불(복구) 처리",
        "장애 대응, 보안 모니터링, 부정 이용 방지",
      ],
      section2Title: "2. 수집 항목",
      collectedItems: [
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
      ],
      section3Title: "3. 보유 및 이용 기간",
      section3Description: "아래 기간은 기본 운영 설정값이며, 법령 또는 운영 정책 변경 시 조정될 수 있습니다.",
      retentionTableHeaders: ["항목", "보유 기간", "비고"],
      retentionRows: [
        ["OTP 해시", "기본 300초", "만료 또는 인증 완료 시 삭제"],
        ["OTP 요청 쿨다운", "기본 60초", "시간 경과 후 자동 삭제"],
        ["OTP 시도 횟수", "최대 5회", "초과 시 OTP 무효화"],
        ["리프레시 토큰", "환경설정 TTL", "로그아웃/탈퇴 시 즉시 삭제"],
        ["업로드 URL", "기본 10분", "만료 후 사용 불가"],
        ["다운로드 URL", "기본 30분", "만료 후 사용 불가"],
        ["공유 토큰", "기본 72시간", "만료 후 접근 불가"],
        ["촬영 이미지", "기본 1일", "스케줄러가 S3 객체 삭제 + DB 키 제거"],
        ["3D 모델/분석 기록", "기본 365일", "스케줄러가 S3 객체 삭제 + DB 행 삭제"],
      ],
      section4Title: "4. 처리 위탁 및 외부 연동",
      processorTableHeaders: ["수탁/연동 서비스", "처리 목적"],
      processors: [
        ["AWS(S3/SES)", "이미지·3D 파일 저장, 이메일 발송"],
        ["Redis", "OTP 상태, 세션 토큰 저장"],
        ["Modal", "신체 측정 파이프라인 실행"],
        ["OpenAI", "스타일 추천 생성"],
        ["Creem", "결제 처리 및 결제 상태 확인"],
        ["Google/Naver/Kakao", "소셜 로그인 인증"],
      ],
      section4Notice: "회사는 법령상 근거 또는 이용자 동의가 있는 경우를 제외하고 개인정보를 임의로 제3자에게 제공하지 않습니다.",
      section5Title: "5. 파기 및 안전성 확보 조치",
      securityBullets: [
        "보유기간 경과 또는 목적 달성 시 지체 없이 파기합니다.",
        "전자파일은 복구가 어려운 방식으로 삭제하며, S3 객체는 삭제 후 DB 참조를 정리합니다.",
        "JWT 기반 인증, 역할 기반 인가, OTP 시도 제한, 결제 웹훅 서명 검증을 적용합니다.",
        "리프레시 토큰은 HttpOnly 쿠키 및 Redis 저장소를 통해 관리합니다.",
      ],
      section6Title: "6. 이용자 권리 및 문의",
      section6Description:
        "이용자는 개인정보 열람·정정·삭제·처리정지를 요청할 수 있으며, 요청은 고객지원 채널로 접수할 수 있습니다.",
      contactText: "개인정보 문의: support@trend-scope.net",
    },
    terms: {
      dateLabel: "시행일자: 2026-02-22 · 최종 업데이트: 2026-02-22",
      section1Title: "1. 서비스 범위",
      serviceItems: [
        "사진 기반 신체 측정(Quick/Premium)",
        "측정 결과 기반 3D 모델 생성 및 제공",
        "측정 결과 기반 AI 스타일 추천",
        "공유 링크를 통한 결과 페이지 공유",
      ],
      section2Title: "2. 계정 및 인증",
      section2Paragraphs: [
        "이용자는 이메일 OTP 또는 소셜 로그인으로 가입/로그인할 수 있으며, 계정 관리 책임은 이용자 본인에게 있습니다.",
        "계정의 무단 사용 또는 보안 이상을 인지한 경우 즉시 고객지원으로 통지해야 합니다.",
      ],
      section3Title: "3. 결제 및 티켓",
      paymentBullets: [
        "측정 서비스 이용에는 모드(Quick/Premium)별 티켓이 필요합니다.",
        "결제 완료 확인 후 티켓이 계정에 적립됩니다.",
        "측정 요청 시 HOLD, 성공 시 CONSUME, 실패 시 RELEASE 로직이 적용됩니다.",
        "환불/복구 기준은 별도 환불·결제 정책 페이지를 따릅니다.",
      ],
      section4Title: "4. 결과 정확도 및 면책",
      section4Bullets: [
        "측정 결과는 촬영 자세, 조명, 배경, 의복, 해상도에 따라 오차가 발생할 수 있습니다.",
        "서비스에서 제공하는 측정/추천 결과는 참고 정보이며, 절대적 정확성을 보장하지 않습니다.",
        "본 서비스는 의료행위 또는 전문 자격사의 판단을 대체하지 않습니다.",
      ],
      section5Title: "5. 공유 링크",
      section5Paragraphs: [
        "공유 링크는 토큰을 보유한 누구나 접근 가능한 URL이며, 기본적으로 72시간 후 만료됩니다.",
        "이용자는 링크 전달로 발생할 수 있는 정보 노출 가능성을 이해하고 신중히 공유해야 합니다.",
      ],
      section6Title: "6. 금지 행위 및 이용 제한",
      prohibitedActs: [
        "타인 계정 또는 개인정보 도용",
        "타인의 사진을 무단 업로드하거나 불법 이미지를 등록하는 행위",
        "비정상 자동화 요청, 보안 우회, 서비스 운영 방해",
        "법령 또는 본 약관에 위반되는 행위",
      ],
      section6Notice: "회사는 위반 행위 확인 시 사전 통지 후 서비스 이용 제한 또는 계정 조치를 할 수 있습니다.",
      section7Title: "7. 서비스 변경 및 중단",
      section7Paragraph:
        "시스템 점검, 외부 연동 서비스(결제/메일/AI 추론) 장애, 불가항력 사유로 서비스 일부가 변경·중단될 수 있습니다.",
      section8Title: "8. 문의",
      contactText: "약관 관련 문의: support@trend-scope.net",
    },
    refund: {
      dateLabel: "최종 업데이트: 2026-02-21",
      section1Title: "1. 결제 방식",
      section1Paragraph: "본 서비스의 티켓 결제는 외부 결제대행사(Creem)를 통해 처리되며, 카드 정보는 당사 서버에 저장되지 않습니다.",
      section2Title: "2. 티켓 지급 시점",
      section2Paragraph: "결제 완료 웹훅이 정상 수신되면 계정에 티켓이 자동 적립됩니다. 중복 웹훅은 멱등 처리됩니다.",
      section3Title: "3. 환불 원칙",
      section3Paragraph:
        "측정 실패 등 서비스 사유가 확인되면 미사용 또는 실패 건에 대해 티켓 환불(복구) 처리가 가능합니다. 이미 정상 사용된 티켓은 환불 대상에서 제외될 수 있습니다.",
      section4Title: "4. 문의",
      section4Paragraph: "결제/환불 문의: support@trend-scope.net",
    },
    openSource: {
      title: "오픈소스 및 제3자 소프트웨어 고지",
      dateLabel: "최종 업데이트: 2026-02-22",
      tableHeaders: ["기술/서비스", "제공자", "용도", "라이선스/약관"],
      section1Title: "1. AI 및 3D 모델링",
      section1Paragraph:
        "본 서비스는 Meta Platforms, Inc.가 공개한 SAM 3D Body 계열 기술을 활용합니다. 해당 기술의 권리와 라이선스는 각 제공자에게 귀속되며, TRENDSCOPE는 독립 서비스입니다.",
      section2Title: "2. 프론트엔드/백엔드/데이터 저장소",
      section3Title: "3. 인프라 및 결제",
      section4Title: "4. 소셜 로그인 연동",
      section5Title: "5. 문의",
      section5Paragraph: "오픈소스/라이선스 고지 문의: support@trend-scope.net",
      ai3dItems: [
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
      ],
      serviceItems: [
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
      ],
      infraItems: [
        {
          name: "Amazon Web Services",
          provider: "Amazon Web Services, Inc.",
          purpose: "S3 파일 저장, SES/Resend 연동 이메일 발송",
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
          name: "Cloudflare",
          provider: "Cloudflare, Inc.",
          purpose: "DNS 및 도메인 관리",
          license: "Cloudflare Terms of Use",
          link: "https://www.cloudflare.com/terms/",
        },
        {
          name: "Creem",
          provider: "Creem",
          purpose: "결제 처리(Merchant of Record)",
          license: "Creem Terms",
          link: "https://www.creem.io/terms",
        },
      ],
      socialItems: [
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
      ],
    },
  },
  en: {
    help: {
      subtitle: "FAQ, operating policies, and support channels",
      section1Title: "1. Getting Started",
      startGuideSteps: [
        "Log in (Email OTP or social login)",
        "Enter profile information (gender/height/weight/nickname)",
        "Choose measurement mode (Quick/Premium)",
        "Upload full-body front/side photos",
        "Review measurement and recommendation results",
      ],
      section2Title: "2. Frequently Asked Questions",
      faqs: [
        {
          q: "Q. I didn't receive the OTP email.",
          a: "A. Check your spam folder and request again. OTP requests have a default 60-second cooldown.",
        },
        {
          q: "Q. Measurement keeps failing.",
          a: "A. Check lighting, image quality, pose, and background. Try again with a clear full-body photo.",
        },
        {
          q: "Q. I paid, but my ticket wasn't added.",
          a: "A. Payment webhook processing can be delayed. Contact support with your order identifier.",
        },
        {
          q: "Q. Shared link doesn't open.",
          a: "A. The share token may be expired (default: 72 hours) or the link is invalid. Create a new link.",
        },
      ],
      section3Title: "3. Policy Shortcuts",
      section4Title: "4. Contact",
      contactText: "General/account/payment/refund/privacy inquiries: support@trend-scope.net",
    },
    privacy: {
      dateLabel: "Effective date: 2026-02-22 · Last updated: 2026-02-22",
      section1Title: "1. Purpose of Processing Personal Data",
      processingPurposes: [
        "User identification, login authentication, account/session management",
        "Photo-based body measurement and 3D model generation/delivery",
        "AI styling recommendation generation and history lookup",
        "Payment verification and ticket accrual/deduction/refund(recovery)",
        "Incident response, security monitoring, abuse prevention",
      ],
      section2Title: "2. Data Collected",
      collectedItems: [
        {
          title: "Account/Auth Data",
          description:
            "For Email OTP login, we process email and OTP hash value (no raw OTP stored). For social login, we process provider user ID and email.",
        },
        {
          title: "Session Data",
          description:
            "Access tokens are validated statelessly; refresh tokens are stored in Redis by user/device.",
        },
        {
          title: "Profile Data",
          description: "Nickname, gender, height, and weight are stored to improve measurement and recommendation quality.",
        },
        {
          title: "Measurement Data",
          description:
            "Front/side image keys, 3D model(GLB) key, measurement result JSON, status/error metadata, and mode(Quick/Premium).",
        },
        {
          title: "Payment/Ticket Data",
          description: "Payment identifiers, ticket type/quantity, and ticket ledger history(HOLD/CONSUME/RELEASE).",
        },
        {
          title: "Operational Logs",
          description: "Minimal logs such as request IP, URL, and exception messages for stability and security.",
        },
      ],
      section3Title: "3. Retention Period",
      section3Description: "The periods below are default operating values and may be adjusted by law or policy updates.",
      retentionTableHeaders: ["Item", "Retention", "Note"],
      retentionRows: [
        ["OTP hash", "Default 300 sec", "Deleted on expiration or successful verification"],
        ["OTP request cooldown", "Default 60 sec", "Auto-deleted after time window"],
        ["OTP attempt count", "Max 5 attempts", "OTP invalidated when exceeded"],
        ["Refresh token", "Configured TTL", "Deleted immediately on logout/withdrawal"],
        ["Upload URL", "Default 10 min", "Unavailable after expiration"],
        ["Download URL", "Default 30 min", "Unavailable after expiration"],
        ["Share token", "Default 72 hrs", "Inaccessible after expiration"],
        ["Uploaded photos", "Default 1 day", "Scheduler removes S3 objects + DB keys"],
        ["3D model/results", "Default 365 days", "Scheduler removes S3 objects + DB rows"],
      ],
      section4Title: "4. Outsourced Processing / External Integrations",
      processorTableHeaders: ["Service", "Purpose"],
      processors: [
        ["AWS (S3/SES)", "Image/3D object storage and email delivery"],
        ["Redis", "OTP state and session token storage"],
        ["Modal", "Body measurement pipeline execution"],
        ["OpenAI", "Style recommendation generation"],
        ["Creem", "Payment processing and status verification"],
        ["Google/Naver/Kakao", "Social login authentication"],
      ],
      section4Notice:
        "Except where required by law or with user consent, we do not arbitrarily provide personal data to third parties.",
      section5Title: "5. Data Deletion and Security Measures",
      securityBullets: [
        "Data is deleted without delay when retention expires or processing purpose is fulfilled.",
        "Electronic files are removed in a non-recoverable manner; S3 objects are deleted and DB references are cleaned up.",
        "JWT-based auth, role-based authorization, OTP attempt limits, and payment webhook signature verification are applied.",
        "Refresh tokens are managed via HttpOnly cookies and Redis storage.",
      ],
      section6Title: "6. User Rights and Contact",
      section6Description:
        "Users may request access, correction, deletion, or suspension of processing. Requests can be submitted through support.",
      contactText: "Privacy inquiries: support@trend-scope.net",
    },
    terms: {
      dateLabel: "Effective date: 2026-02-22 · Last updated: 2026-02-22",
      section1Title: "1. Service Scope",
      serviceItems: [
        "Photo-based body measurement (Quick/Premium)",
        "3D model generation and delivery based on measurement results",
        "AI styling recommendations based on measurement results",
        "Result sharing via public share links",
      ],
      section2Title: "2. Account and Authentication",
      section2Paragraphs: [
        "Users can sign up/log in via Email OTP or social login, and are responsible for managing their account credentials.",
        "If unauthorized use or account security issues are detected, users must notify support immediately.",
      ],
      section3Title: "3. Payment and Tickets",
      paymentBullets: [
        "Tickets are required by mode (Quick/Premium).",
        "Tickets are credited after payment completion is confirmed.",
        "Ticket ledger logic applies as HOLD on request, CONSUME on success, RELEASE on failure.",
        "Refund/recovery criteria follow the dedicated Refund & Payment Policy page.",
      ],
      section4Title: "4. Result Accuracy and Disclaimer",
      section4Bullets: [
        "Measurement accuracy may vary depending on pose, lighting, background, clothing, and image quality.",
        "Measurements and recommendations are reference information and do not guarantee absolute accuracy.",
        "This service does not replace medical services or licensed professional judgment.",
      ],
      section5Title: "5. Share Links",
      section5Paragraphs: [
        "Share links are accessible by anyone with the token URL and expire after 72 hours by default.",
        "Users should share carefully, acknowledging potential information exposure.",
      ],
      section6Title: "6. Prohibited Conduct and Restrictions",
      prohibitedActs: [
        "Impersonation or unauthorized use of another person's account/data",
        "Uploading others' photos without permission or illegal images",
        "Abusive automation, security bypass attempts, or service disruption",
        "Any conduct violating law or these Terms",
      ],
      section6Notice:
        "If violations are confirmed, we may restrict service usage or take account action with prior notice.",
      section7Title: "7. Service Changes and Suspension",
      section7Paragraph:
        "Parts of the service may change or be suspended due to maintenance, external integration issues (payment/email/AI), or force majeure.",
      section8Title: "8. Contact",
      contactText: "Terms inquiries: support@trend-scope.net",
    },
    refund: {
      dateLabel: "Last updated: 2026-02-21",
      section1Title: "1. Payment Method",
      section1Paragraph:
        "Ticket payments are processed via an external payment provider (Creem). Card details are not stored on our servers.",
      section2Title: "2. Ticket Credit Timing",
      section2Paragraph:
        "Tickets are credited automatically when payment-completion webhook is received. Duplicate webhooks are handled idempotently.",
      section3Title: "3. Refund Principles",
      section3Paragraph:
        "If a service-side issue is confirmed (e.g., measurement failure), refunds/recovery may be provided for unused or failed cases. Tickets consumed successfully may not be refundable.",
      section4Title: "4. Contact",
      section4Paragraph: "Payment/refund inquiries: support@trend-scope.net",
    },
    openSource: {
      title: "Open Source and Third-Party Software Notices",
      dateLabel: "Last updated: 2026-02-22",
      tableHeaders: ["Technology/Service", "Provider", "Purpose", "License/Terms"],
      section1Title: "1. AI and 3D Modeling",
      section1Paragraph:
        "This service uses SAM 3D Body-related technology released by Meta Platforms, Inc. Rights and licenses belong to each provider, and TRENDSCOPE operates as an independent service.",
      section2Title: "2. Frontend/Backend/Data Storage",
      section3Title: "3. Infrastructure and Payments",
      section4Title: "4. Social Login Integrations",
      section5Title: "5. Contact",
      section5Paragraph: "Open-source/license inquiries: support@trend-scope.net",
      ai3dItems: [
        {
          name: "SAM 3D Body",
          provider: "Meta Platforms, Inc.",
          purpose: "Photo-based 3D human mesh reconstruction",
          license: "SAM License",
          link: "https://github.com/facebookresearch/sam-3d-body",
        },
        {
          name: "Momentum Human Rig (MHR)",
          provider: "Meta Platforms, Inc.",
          purpose: "Parametric 3D human mesh model",
          license: "SAM License",
          link: "https://github.com/facebookresearch/sam-3d-body/blob/main/LICENSE",
        },
        {
          name: "trimesh",
          provider: "Michael Dawson-Haggerty",
          purpose: "3D mesh processing and GLB conversion",
          license: "MIT License",
          link: "https://github.com/mikedh/trimesh",
        },
        {
          name: "OpenAI API",
          provider: "OpenAI, Inc.",
          purpose: "Style recommendation generation from measurement results",
          license: "OpenAI Terms of Use",
          link: "https://openai.com/policies/terms-of-use",
        },
      ],
      serviceItems: [
        {
          name: "React",
          provider: "Meta Platforms, Inc.",
          purpose: "Frontend UI framework",
          license: "MIT License",
          link: "https://github.com/facebook/react",
        },
        {
          name: "Spring Boot",
          provider: "VMware, Inc.",
          purpose: "Backend application framework",
          license: "Apache License 2.0",
          link: "https://github.com/spring-projects/spring-boot",
        },
        {
          name: "PostgreSQL",
          provider: "PostgreSQL Global Development Group",
          purpose: "Relational database",
          license: "PostgreSQL License",
          link: "https://www.postgresql.org/about/licence/",
        },
        {
          name: "Redis",
          provider: "Redis Ltd.",
          purpose: "In-memory cache/session store",
          license: "Varies by version (BSD/RSAL/SSPL/AGPL)",
          link: "https://redis.io/legal/licenses/",
        },
      ],
      infraItems: [
        {
          name: "Amazon Web Services",
          provider: "Amazon Web Services, Inc.",
          purpose: "S3 storage and email delivery integration",
          license: "AWS Customer Agreement",
          link: "https://aws.amazon.com/agreement/",
        },
        {
          name: "Modal",
          provider: "Modal Labs, Inc.",
          purpose: "AI analysis pipeline execution",
          license: "Modal Terms of Service",
          link: "https://modal.com/legal/terms",
        },
        {
          name: "Cloudflare",
          provider: "Cloudflare, Inc.",
          purpose: "DNS and domain management",
          license: "Cloudflare Terms of Use",
          link: "https://www.cloudflare.com/terms/",
        },
        {
          name: "Creem",
          provider: "Creem",
          purpose: "Payment processing (Merchant of Record)",
          license: "Creem Terms",
          link: "https://www.creem.io/terms",
        },
      ],
      socialItems: [
        {
          name: "Google Identity Services",
          provider: "Google LLC",
          purpose: "Google OAuth login",
          license: "Google APIs Terms",
          link: "https://developers.google.com/terms",
        },
        {
          name: "Naver Login",
          provider: "NAVER Corp.",
          purpose: "Naver OAuth login",
          license: "Naver Developer Terms",
          link: "https://developers.naver.com/terms/terms.html",
        },
        {
          name: "Kakao Login",
          provider: "Kakao Corp.",
          purpose: "Kakao OAuth login",
          license: "Kakao Developers Terms",
          link: "https://developers.kakao.com/terms",
        },
      ],
    },
  },
  ja: {
    help: {
      subtitle: "よくある質問・運営ポリシー・お問い合わせ窓口の案内",
      section1Title: "1. はじめ方",
      startGuideSteps: [
        "ログイン（メールOTP または ソーシャルログイン）",
        "プロフィール情報入力（性別/身長/体重/ニックネーム）",
        "測定モード選択（Quick/Premium）",
        "正面/側面の全身写真をアップロード",
        "分析完了後に結果と提案を確認",
      ],
      section2Title: "2. よくある質問",
      faqs: [
        {
          q: "Q. OTPメールが届きません。",
          a: "A. 迷惑メールフォルダを確認し、再送してください。OTP再送には通常60秒のクールダウンがあります。",
        },
        {
          q: "Q. 測定が失敗します。",
          a: "A. 照明、解像度、姿勢、背景を確認し、輪郭がはっきりした全身写真で再試行してください。",
        },
        {
          q: "Q. 決済したのにチケットが付与されません。",
          a: "A. 決済Webhookの反映が遅延する場合があります。注文識別子を添えてサポートへご連絡ください。",
        },
        {
          q: "Q. 共有リンクが開けません。",
          a: "A. トークン有効期限切れ（デフォルト72時間）またはリンク破損の可能性があります。新しいリンクを発行してください。",
        },
      ],
      section3Title: "3. ポリシーへのリンク",
      section4Title: "4. お問い合わせ",
      contactText: "一般/アカウント/決済/返金/個人情報に関するお問い合わせ: support@trend-scope.net",
    },
    privacy: {
      dateLabel: "施行日: 2026-02-22 · 最終更新: 2026-02-22",
      section1Title: "1. 個人情報の利用目的",
      processingPurposes: [
        "会員識別、ログイン認証、アカウント/セッション管理",
        "写真ベースの身体計測と3Dモデル生成/提供",
        "AIスタイル提案の生成および履歴提供",
        "決済確認、チケット付与・差引・返金(復元)処理",
        "障害対応、セキュリティ監視、不正利用防止",
      ],
      section2Title: "2. 取得項目",
      collectedItems: [
        {
          title: "アカウント/認証情報",
          description: "メールOTPログイン時はメールアドレスとOTPハッシュ（平文は保存しない）、ソーシャルログイン時は提供者識別子とメールを処理します。",
        },
        {
          title: "セッション情報",
          description: "アクセストークンはサーバー保存せず検証に使用し、リフレッシュトークンはRedisにユーザー・デバイス単位で保存します。",
        },
        {
          title: "プロフィール情報",
          description: "ニックネーム、性別、身長、体重を保存し、測定・提案品質の向上に利用します。",
        },
        {
          title: "測定データ",
          description: "正面/側面画像キー、3Dモデル(GLB)キー、結果JSON、状態/エラー情報、モード(Quick/Premium)を処理します。",
        },
        {
          title: "決済/チケット情報",
          description: "決済識別情報、チケット種別・数量、チケット台帳履歴(HOLD/CONSUME/RELEASE等)を処理します。",
        },
        {
          title: "運用ログ",
          description: "リクエストIP、URL、例外メッセージなど、安定運用に必要な最小限のログを収集します。",
        },
      ],
      section3Title: "3. 保有期間",
      section3Description: "以下の期間は初期運用値であり、法令や運用方針の変更により調整される場合があります。",
      retentionTableHeaders: ["項目", "保有期間", "備考"],
      retentionRows: [
        ["OTPハッシュ", "基本300秒", "有効期限切れまたは認証完了時に削除"],
        ["OTP再送クールダウン", "基本60秒", "時間経過後に自動削除"],
        ["OTP試行回数", "最大5回", "超過時にOTP無効化"],
        ["リフレッシュトークン", "設定TTL", "ログアウト/退会時に即時削除"],
        ["アップロードURL", "基本10分", "期限後は使用不可"],
        ["ダウンロードURL", "基本30分", "期限後は使用不可"],
        ["共有トークン", "基本72時間", "期限後はアクセス不可"],
        ["撮影画像", "基本1日", "スケジューラがS3削除 + DBキー整理"],
        ["3Dモデル/分析履歴", "基本365日", "スケジューラがS3削除 + DB行削除"],
      ],
      section4Title: "4. 委託処理および外部連携",
      processorTableHeaders: ["委託/連携サービス", "目的"],
      processors: [
        ["AWS(S3/SES)", "画像・3Dファイル保存、メール送信"],
        ["Redis", "OTP状態、セッショントークン保存"],
        ["Modal", "身体計測パイプライン実行"],
        ["OpenAI", "スタイル提案生成"],
        ["Creem", "決済処理および状態確認"],
        ["Google/Naver/Kakao", "ソーシャルログイン認証"],
      ],
      section4Notice: "法令上の根拠または利用者同意がある場合を除き、個人情報を任意に第三者提供しません。",
      section5Title: "5. 廃棄および安全管理措置",
      securityBullets: [
        "保有期間満了または目的達成時に遅滞なく廃棄します。",
        "電子ファイルは復元困難な方法で削除し、S3オブジェクト削除後にDB参照を整理します。",
        "JWT認証、ロールベース認可、OTP試行制限、決済Webhook署名検証を適用します。",
        "リフレッシュトークンはHttpOnly CookieおよびRedisで管理します。",
      ],
      section6Title: "6. 利用者の権利とお問い合わせ",
      section6Description: "利用者は個人情報の開示・訂正・削除・処理停止を請求できます。請求はサポート窓口で受け付けます。",
      contactText: "個人情報に関するお問い合わせ: support@trend-scope.net",
    },
    terms: {
      dateLabel: "施行日: 2026-02-22 · 最終更新: 2026-02-22",
      section1Title: "1. サービス範囲",
      serviceItems: [
        "写真ベースの身体計測（Quick/Premium）",
        "計測結果に基づく3Dモデル生成・提供",
        "計測結果に基づくAIスタイル提案",
        "共有リンクによる結果ページ共有",
      ],
      section2Title: "2. アカウントと認証",
      section2Paragraphs: [
        "利用者はメールOTPまたはソーシャルログインで登録/ログインでき、アカウント管理責任は利用者本人にあります。",
        "不正利用やセキュリティ異常を認知した場合は、直ちにサポートへ通知する必要があります。",
      ],
      section3Title: "3. 決済とチケット",
      paymentBullets: [
        "サービス利用にはモード（Quick/Premium）別チケットが必要です。",
        "決済完了確認後、チケットがアカウントへ付与されます。",
        "測定要求時にHOLD、成功時にCONSUME、失敗時にRELEASEロジックが適用されます。",
        "返金/復元基準は別途「返金・決済ポリシー」に従います。",
      ],
      section4Title: "4. 精度と免責",
      section4Bullets: [
        "結果は姿勢、照明、背景、服装、解像度等により誤差が生じる場合があります。",
        "本サービスの測定/提案結果は参考情報であり、絶対的な正確性を保証しません。",
        "本サービスは医療行為や有資格者の判断を代替しません。",
      ],
      section5Title: "5. 共有リンク",
      section5Paragraphs: [
        "共有リンクはトークンURLを知る第三者が閲覧可能で、デフォルトで72時間後に失効します。",
        "利用者は情報露出の可能性を理解し、慎重に共有する必要があります。",
      ],
      section6Title: "6. 禁止行為および利用制限",
      prohibitedActs: [
        "他人のアカウントまたは個人情報の不正利用",
        "他人写真の無断アップロードや違法画像の登録",
        "異常な自動化要求、セキュリティ回避、サービス妨害",
        "法令または本規約に違反する行為",
      ],
      section6Notice: "違反行為が確認された場合、事前通知の上で利用制限やアカウント措置を実施することがあります。",
      section7Title: "7. サービス変更・停止",
      section7Paragraph: "システム点検、外部連携（決済/メール/AI）障害、不可抗力等によりサービスの一部が変更・停止される場合があります。",
      section8Title: "8. お問い合わせ",
      contactText: "規約に関するお問い合わせ: support@trend-scope.net",
    },
    refund: {
      dateLabel: "最終更新: 2026-02-21",
      section1Title: "1. 決済方式",
      section1Paragraph: "チケット決済は外部決済代行（Creem）を通じて処理され、カード情報は当社サーバーに保存されません。",
      section2Title: "2. チケット付与タイミング",
      section2Paragraph: "決済完了Webhookを正常受信すると、チケットが自動付与されます。重複Webhookは冪等処理されます。",
      section3Title: "3. 返金原則",
      section3Paragraph:
        "測定失敗などサービス起因が確認された場合、未使用または失敗案件について返金（復元）対象となることがあります。正常使用済みチケットは対象外となる場合があります。",
      section4Title: "4. お問い合わせ",
      section4Paragraph: "決済/返金に関するお問い合わせ: support@trend-scope.net",
    },
    openSource: {
      title: "オープンソースおよび第三者ソフトウェアに関する告知",
      dateLabel: "最終更新: 2026-02-22",
      tableHeaders: ["技術/サービス", "提供者", "用途", "ライセンス/規約"],
      section1Title: "1. AIおよび3Dモデリング",
      section1Paragraph:
        "本サービスは Meta Platforms, Inc. が公開した SAM 3D Body 系技術を利用しています。権利およびライセンスは各提供者に帰属し、TRENDSCOPE は独立したサービスです。",
      section2Title: "2. フロントエンド/バックエンド/データストア",
      section3Title: "3. インフラおよび決済",
      section4Title: "4. ソーシャルログイン連携",
      section5Title: "5. お問い合わせ",
      section5Paragraph: "オープンソース/ライセンス告知に関するお問い合わせ: support@trend-scope.net",
      ai3dItems: [
        {
          name: "SAM 3D Body",
          provider: "Meta Platforms, Inc.",
          purpose: "写真ベースの3D人体メッシュ復元",
          license: "SAM License",
          link: "https://github.com/facebookresearch/sam-3d-body",
        },
        {
          name: "Momentum Human Rig (MHR)",
          provider: "Meta Platforms, Inc.",
          purpose: "3D人体パラメトリックメッシュモデル",
          license: "SAM License",
          link: "https://github.com/facebookresearch/sam-3d-body/blob/main/LICENSE",
        },
        {
          name: "trimesh",
          provider: "Michael Dawson-Haggerty",
          purpose: "3Dメッシュ処理およびGLB変換",
          license: "MIT License",
          link: "https://github.com/mikedh/trimesh",
        },
        {
          name: "OpenAI API",
          provider: "OpenAI, Inc.",
          purpose: "計測結果ベースのスタイル提案生成",
          license: "OpenAI Terms of Use",
          link: "https://openai.com/policies/terms-of-use",
        },
      ],
      serviceItems: [
        {
          name: "React",
          provider: "Meta Platforms, Inc.",
          purpose: "フロントエンドUI構築",
          license: "MIT License",
          link: "https://github.com/facebook/react",
        },
        {
          name: "Spring Boot",
          provider: "VMware, Inc.",
          purpose: "バックエンドアプリケーションフレームワーク",
          license: "Apache License 2.0",
          link: "https://github.com/spring-projects/spring-boot",
        },
        {
          name: "PostgreSQL",
          provider: "PostgreSQL Global Development Group",
          purpose: "リレーショナルデータベース",
          license: "PostgreSQL License",
          link: "https://www.postgresql.org/about/licence/",
        },
        {
          name: "Redis",
          provider: "Redis Ltd.",
          purpose: "インメモリキャッシュ/セッションストア",
          license: "バージョンにより異なる(BSD/RSAL/SSPL/AGPL)",
          link: "https://redis.io/legal/licenses/",
        },
      ],
      infraItems: [
        {
          name: "Amazon Web Services",
          provider: "Amazon Web Services, Inc.",
          purpose: "S3保存、メール送信連携",
          license: "AWS Customer Agreement",
          link: "https://aws.amazon.com/agreement/",
        },
        {
          name: "Modal",
          provider: "Modal Labs, Inc.",
          purpose: "AI分析パイプライン実行",
          license: "Modal Terms of Service",
          link: "https://modal.com/legal/terms",
        },
        {
          name: "Cloudflare",
          provider: "Cloudflare, Inc.",
          purpose: "DNSおよびドメイン管理",
          license: "Cloudflare Terms of Use",
          link: "https://www.cloudflare.com/terms/",
        },
        {
          name: "Creem",
          provider: "Creem",
          purpose: "決済処理（Merchant of Record）",
          license: "Creem Terms",
          link: "https://www.creem.io/terms",
        },
      ],
      socialItems: [
        {
          name: "Google Identity Services",
          provider: "Google LLC",
          purpose: "Google OAuth ログイン",
          license: "Google APIs Terms",
          link: "https://developers.google.com/terms",
        },
        {
          name: "Naver Login",
          provider: "NAVER Corp.",
          purpose: "Naver OAuth ログイン",
          license: "Naver Developer Terms",
          link: "https://developers.naver.com/terms/terms.html",
        },
        {
          name: "Kakao Login",
          provider: "Kakao Corp.",
          purpose: "Kakao OAuth ログイン",
          license: "Kakao Developers Terms",
          link: "https://developers.kakao.com/terms",
        },
      ],
    },
  },
  zh: {
    help: {
      subtitle: "常见问题、运营政策与联系渠道说明",
      section1Title: "1. 快速开始",
      startGuideSteps: [
        "登录（邮箱 OTP 或社交登录）",
        "填写个人信息（性别/身高/体重/昵称）",
        "选择测量模式（Quick/Premium）",
        "上传正面/侧面全身照片",
        "分析完成后查看结果与推荐",
      ],
      section2Title: "2. 常见问题",
      faqs: [
        {
          q: "Q. 收不到 OTP 邮件。",
          a: "A. 请先检查垃圾邮件箱后重新发送。OTP 重发默认有 60 秒冷却时间。",
        },
        {
          q: "Q. 测量一直失败。",
          a: "A. 请检查光线、分辨率、姿势与背景，并使用轮廓清晰的全身照片重试。",
        },
        {
          q: "Q. 我已付款但票券没到账。",
          a: "A. 支付 webhook 可能延迟，请附上订单标识联系 support 邮箱。",
        },
        {
          q: "Q. 分享链接打不开。",
          a: "A. 可能是分享令牌过期（默认 72 小时）或链接损坏，请重新生成链接。",
        },
      ],
      section3Title: "3. 政策快捷入口",
      section4Title: "4. 联系方式",
      contactText: "通用/账号/支付/退款/隐私咨询: support@trend-scope.net",
    },
    privacy: {
      dateLabel: "生效日期：2026-02-22 · 最后更新：2026-02-22",
      section1Title: "1. 个人信息处理目的",
      processingPurposes: [
        "用户识别、登录认证、账号与会话管理",
        "基于照片的身体测量与 3D 模型生成/提供",
        "AI 穿搭推荐生成与历史记录查询",
        "支付确认、票券发放/扣减/退款（恢复）处理",
        "故障应对、安全监控与防止滥用",
      ],
      section2Title: "2. 收集项目",
      collectedItems: [
        {
          title: "账号/认证信息",
          description: "邮箱 OTP 登录时处理邮箱和 OTP 哈希值（不保存明文）；社交登录时处理平台用户标识和邮箱。",
        },
        {
          title: "会话信息",
          description: "访问令牌采用无状态校验；刷新令牌按用户/设备维度存储在 Redis 中。",
        },
        {
          title: "个人资料",
          description: "昵称、性别、身高、体重用于提升测量与推荐质量。",
        },
        {
          title: "测量数据",
          description: "处理正面/侧面图片键、3D 模型(GLB)键、测量结果 JSON、状态/错误信息及模式(Quick/Premium)。",
        },
        {
          title: "支付/票券数据",
          description: "处理支付标识、票券类型/数量及票券台账记录(HOLD/CONSUME/RELEASE 等)。",
        },
        {
          title: "运营日志",
          description: "为稳定性与安全，收集最小化日志，如请求 IP、URL、异常信息。",
        },
      ],
      section3Title: "3. 保存与使用期限",
      section3Description: "以下期限为默认运营配置，可能根据法律或运营政策调整。",
      retentionTableHeaders: ["项目", "保存期限", "备注"],
      retentionRows: [
        ["OTP 哈希", "默认 300 秒", "过期或认证完成后删除"],
        ["OTP 请求冷却", "默认 60 秒", "时间到后自动删除"],
        ["OTP 尝试次数", "最多 5 次", "超过后 OTP 作废"],
        ["刷新令牌", "按配置 TTL", "登出/注销时立即删除"],
        ["上传 URL", "默认 10 分钟", "过期后不可用"],
        ["下载 URL", "默认 30 分钟", "过期后不可用"],
        ["分享令牌", "默认 72 小时", "过期后不可访问"],
        ["拍摄图片", "默认 1 天", "定时任务删除 S3 对象并清理 DB 键"],
        ["3D 模型/分析记录", "默认 365 天", "定时任务删除 S3 对象并删除 DB 行"],
      ],
      section4Title: "4. 委托处理与外部联动",
      processorTableHeaders: ["委托/联动服务", "处理目的"],
      processors: [
        ["AWS(S3/SES)", "图片/3D 文件存储与邮件发送"],
        ["Redis", "OTP 状态与会话令牌存储"],
        ["Modal", "身体测量流水线执行"],
        ["OpenAI", "穿搭推荐生成"],
        ["Creem", "支付处理与支付状态确认"],
        ["Google/Naver/Kakao", "社交登录认证"],
      ],
      section4Notice: "除法律依据或获得用户同意外，我们不会任意向第三方提供个人信息。",
      section5Title: "5. 删除与安全措施",
      securityBullets: [
        "超过保存期限或处理目的达成后，将及时删除。",
        "电子文件采用不可恢复方式删除；S3 对象删除后同步清理数据库引用。",
        "采用 JWT 认证、基于角色的授权、OTP 尝试限制、支付 webhook 签名校验。",
        "刷新令牌通过 HttpOnly Cookie 与 Redis 进行管理。",
      ],
      section6Title: "6. 用户权利与咨询",
      section6Description: "用户可申请查阅、更正、删除或限制处理个人信息，可通过客服渠道提交申请。",
      contactText: "隐私咨询：support@trend-scope.net",
    },
    terms: {
      dateLabel: "生效日期：2026-02-22 · 最后更新：2026-02-22",
      section1Title: "1. 服务范围",
      serviceItems: [
        "基于照片的身体测量（Quick/Premium）",
        "基于测量结果的 3D 模型生成与提供",
        "基于测量结果的 AI 穿搭推荐",
        "通过分享链接共享结果页面",
      ],
      section2Title: "2. 账号与认证",
      section2Paragraphs: [
        "用户可通过邮箱 OTP 或社交登录注册/登录，账号管理责任由用户本人承担。",
        "如发现账号被盗用或安全异常，应立即通知客服。",
      ],
      section3Title: "3. 支付与票券",
      paymentBullets: [
        "使用服务需按模式（Quick/Premium）消耗相应票券。",
        "支付完成确认后，票券将发放至账号。",
        "发起测量时执行 HOLD，成功后 CONSUME，失败后 RELEASE。",
        "退款/恢复标准以《退款/支付政策》页面为准。",
      ],
      section4Title: "4. 结果准确性与免责声明",
      section4Bullets: [
        "测量结果可能受姿势、光线、背景、服装与图像质量影响产生误差。",
        "服务提供的测量/推荐仅供参考，不保证绝对准确。",
        "本服务不构成医疗行为，也不替代专业人员判断。",
      ],
      section5Title: "5. 分享链接",
      section5Paragraphs: [
        "分享链接对持有令牌 URL 的任何人可访问，默认 72 小时后失效。",
        "用户应理解分享可能带来的信息暴露风险并谨慎传播。",
      ],
      section6Title: "6. 禁止行为与使用限制",
      prohibitedActs: [
        "冒用他人账号或个人信息",
        "未经许可上传他人照片或上传违法图像",
        "异常自动化请求、绕过安全机制或干扰服务运行",
        "违反法律法规或本条款的行为",
      ],
      section6Notice: "若确认存在违规行为，我们可在事先通知后采取限制使用或账号处置措施。",
      section7Title: "7. 服务变更与中断",
      section7Paragraph: "因系统维护、外部联动服务（支付/邮件/AI）故障或不可抗力，服务部分功能可能变更或中断。",
      section8Title: "8. 联系方式",
      contactText: "条款咨询：support@trend-scope.net",
    },
    refund: {
      dateLabel: "最后更新：2026-02-21",
      section1Title: "1. 支付方式",
      section1Paragraph: "本服务票券支付通过第三方支付服务商（Creem）处理，卡信息不会保存在我方服务器。",
      section2Title: "2. 票券到账时间",
      section2Paragraph: "收到支付完成 webhook 后，票券将自动入账。重复 webhook 会按幂等规则处理。",
      section3Title: "3. 退款原则",
      section3Paragraph:
        "若确认属于服务侧原因（如测量失败），可对未使用或失败订单进行票券退款（恢复）。已正常使用的票券可能不在退款范围内。",
      section4Title: "4. 联系方式",
      section4Paragraph: "支付/退款咨询：support@trend-scope.net",
    },
    openSource: {
      title: "开源与第三方软件告知",
      dateLabel: "最后更新：2026-02-22",
      tableHeaders: ["技术/服务", "提供方", "用途", "许可证/条款"],
      section1Title: "1. AI 与 3D 建模",
      section1Paragraph:
        "本服务使用 Meta Platforms, Inc. 公开的 SAM 3D Body 系列技术。相关权利与许可证归各提供方所有，TRENDSCOPE 为独立服务。",
      section2Title: "2. 前端/后端/数据存储",
      section3Title: "3. 基础设施与支付",
      section4Title: "4. 社交登录集成",
      section5Title: "5. 联系方式",
      section5Paragraph: "开源/许可证告知咨询：support@trend-scope.net",
      ai3dItems: [
        {
          name: "SAM 3D Body",
          provider: "Meta Platforms, Inc.",
          purpose: "基于照片的人体 3D 网格重建",
          license: "SAM License",
          link: "https://github.com/facebookresearch/sam-3d-body",
        },
        {
          name: "Momentum Human Rig (MHR)",
          provider: "Meta Platforms, Inc.",
          purpose: "人体 3D 参数化网格模型",
          license: "SAM License",
          link: "https://github.com/facebookresearch/sam-3d-body/blob/main/LICENSE",
        },
        {
          name: "trimesh",
          provider: "Michael Dawson-Haggerty",
          purpose: "3D 网格处理与 GLB 转换",
          license: "MIT License",
          link: "https://github.com/mikedh/trimesh",
        },
        {
          name: "OpenAI API",
          provider: "OpenAI, Inc.",
          purpose: "基于测量结果生成穿搭推荐",
          license: "OpenAI Terms of Use",
          link: "https://openai.com/policies/terms-of-use",
        },
      ],
      serviceItems: [
        {
          name: "React",
          provider: "Meta Platforms, Inc.",
          purpose: "前端 UI 构建",
          license: "MIT License",
          link: "https://github.com/facebook/react",
        },
        {
          name: "Spring Boot",
          provider: "VMware, Inc.",
          purpose: "后端应用框架",
          license: "Apache License 2.0",
          link: "https://github.com/spring-projects/spring-boot",
        },
        {
          name: "PostgreSQL",
          provider: "PostgreSQL Global Development Group",
          purpose: "关系型数据库",
          license: "PostgreSQL License",
          link: "https://www.postgresql.org/about/licence/",
        },
        {
          name: "Redis",
          provider: "Redis Ltd.",
          purpose: "内存缓存/会话存储",
          license: "不同版本不同(BSD/RSAL/SSPL/AGPL)",
          link: "https://redis.io/legal/licenses/",
        },
      ],
      infraItems: [
        {
          name: "Amazon Web Services",
          provider: "Amazon Web Services, Inc.",
          purpose: "S3 存储与邮件发送联动",
          license: "AWS Customer Agreement",
          link: "https://aws.amazon.com/agreement/",
        },
        {
          name: "Modal",
          provider: "Modal Labs, Inc.",
          purpose: "AI 分析流水线执行",
          license: "Modal Terms of Service",
          link: "https://modal.com/legal/terms",
        },
        {
          name: "Cloudflare",
          provider: "Cloudflare, Inc.",
          purpose: "DNS 与域名管理",
          license: "Cloudflare Terms of Use",
          link: "https://www.cloudflare.com/terms/",
        },
        {
          name: "Creem",
          provider: "Creem",
          purpose: "支付处理（Merchant of Record）",
          license: "Creem Terms",
          link: "https://www.creem.io/terms",
        },
      ],
      socialItems: [
        {
          name: "Google Identity Services",
          provider: "Google LLC",
          purpose: "Google OAuth 登录",
          license: "Google APIs Terms",
          link: "https://developers.google.com/terms",
        },
        {
          name: "Naver Login",
          provider: "NAVER Corp.",
          purpose: "Naver OAuth 登录",
          license: "Naver Developer Terms",
          link: "https://developers.naver.com/terms/terms.html",
        },
        {
          name: "Kakao Login",
          provider: "Kakao Corp.",
          purpose: "Kakao OAuth 登录",
          license: "Kakao Developers Terms",
          link: "https://developers.kakao.com/terms",
        },
      ],
    },
  },
};
