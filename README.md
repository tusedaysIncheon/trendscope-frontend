# Vote Frontend

이 프로젝트는 투표 애플리케이션의 프론트엔드 파트로, 사용자들이 다양한 주제에 대해 투표하고 결과를 확인할 수 있는 웹 서비스를 제공합니다. React와 TypeScript를 기반으로 하여 타입 안정성과 개발 생산성을 높였으며, 모던 웹 기술 스택을 활용하여 최적의 사용자 경험을 제공하는 것을 목표로 합니다.

## 🚀 주요 기술 스택

| 구분 | 기술 | 설명 |
| --- | --- | --- |
| **Core** | React, Vite, TypeScript | UI 구축, 빌드 시스템 및 타입 안정성 확보 |
| **Styling** | Tailwind CSS, shadcn/ui | 빠른 UI 개발 및 일관된 디자인 시스템 |
| **State Management** | Zustand, React Query | 전역 상태 및 서버 상태 관리 |
| **Routing** | React Router DOM | SPA(단일 페이지 애플리케이션) 라우팅 처리 |
| **Form Handling** | React Hook Form, Zod | 폼 상태 관리 및 스키마 기반 유효성 검사 |
| **API Client** | Axios | HTTP 요청 및 응답 처리, 인터셉터를 통한 토큰 관리 |
| **Linting** | ESLint, TypeScript ESLint | 코드 품질 및 일관성 유지 |

## ✨ 주요 기능

### 1. 사용자 인증
- **이메일/비밀번호 가입 및 로그인**: 기본적인 사용자 인증 시스템을 제공합니다.
- **소셜 로그인**: Google, Naver, Kakao 계정을 이용한 간편 로그인을 지원합니다.
- **JWT 기반 세션 관리**: Access Token과 Refresh Token을 사용하여 안전하고 지속적인 사용자 세션을 관리하며, 자동으로 토큰을 갱신합니다.
- **인증 상태에 따른 UI/UX**: 로그인 여부에 따라 헤더, 네비게이션 바 등 UI가 동적으로 변경됩니다.

### 2. 사용자 경험
- **반응형 디자인**: 데스크톱과 모바일 환경에 최적화된 UI를 제공합니다.
- **테마 전환**: 사용자가 Light/Dark 모드를 선택할 수 있습니다.
- **입력 폼 유효성 검사**: Zod 스키마를 활용하여 회원가입 등 폼 제출 시 실시간으로 데이터 유효성을 검사합니다.
- **사용자 피드백**: Sonner를 통해 API 요청 결과(성공, 실패 등)를 사용자에게 즉각적으로 알립니다.

### 3. 상태 및 데이터 관리
- **전역 상태 관리**: Zustand를 사용하여 사용자 인증 정보 등 앱 전반의 상태를 효율적으로 관리합니다.
- **서버 상태 관리**: React Query를 도입하여 API 데이터 캐싱, 재요청 등 서버 상태를 선언적으로 관리합니다.
- **API 클라이언트**: Axios 인스턴스를 설정하여 API 요청/응답을 중앙에서 관리하고, 인터셉터를 통해 JWT 토큰을 자동으로 헤더에 추가합니다.

## 🏁 시작하기

### 1. 저장소 복제
```bash
git clone https://github.com/your-username/vote-frontend.git
cd vote-frontend
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 애플리케이션 실행
```bash
npm run dev
```
이제 http://localhost:5173 에서 애플리케이션을 확인할 수 있습니다.

## 🛠️ 사용 가능한 스크립트

- **`npm run dev`**: 개발 모드로 Vite 서버를 실행합니다. Hot-reloading을 지원합니다.
- **`npm run build`**: 프로덕션용으로 프로젝트를 빌드합니다. `dist` 디렉토리에 결과물이 생성됩니다.
- **`npm run lint`**: ESLint를 사용하여 코드 스타일 및 잠재적 오류를 검사합니다.
- **`npm run preview`**: 프로덕션 빌드 결과물을 로컬에서 미리 확인합니다.

## 📂 폴더 구조

 vote-frontend/
 ├── src/
 │ ├── assets/      # 이미지, 폰트 등 정적 에셋
 │ ├── components/  # 재사용 가능한 UI 컴포넌트 (UI, Form, Layouts)
 │ ├── hooks/       # 커스텀 훅
 │ ├── lib/         # API 클라이언트, 유틸리티 함수, Zod 스키마
 │ ├── pages/       # 라우팅 단위의 페이지 컴포넌트
 │ ├── store/       # Zustand를 사용한 전역 상태 저장소
 │ └── types/       # 프로젝트 전반에서 사용되는 타입 정의
 ├── vite.config.ts # Vite 설정 파일
 ├── tsconfig.json  # TypeScript 설정 파일
 └── package.json   # 프로젝트 의존성 및 스크립트