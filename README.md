# Vote Frontend

이 프로젝트는 투표 애플리케이션의 프론트엔드 파트로, 사용자들이 다양한 주제에 대해 투표하고 결과를 확인할 수 있는 웹 서비스를 제공합니다. React와 TypeScript를 기반으로 하여 타입 안정성과 개발 생산성을 높였으며, 모던 웹 기술 스택을 활용하여 최적의 사용자 경험을 제공하는 것을 목표로 합니다.

## 🚀 주요 기술 스택

| 구분 | 기술 | 설명 |
| --- | --- | --- |
| **Core** | React, Vite, TypeScript | UI 구축, 빌드 시스템 및 타입 안정성 확보 |
| **Styling** | Tailwind CSS, shadcn/ui | 빠른 UI 개발 및 일관된 디자인 시스템 |
| **UI & Icons** | lucide-react, react-icons | 아이콘 라이브러리 |
| **State Management** | Zustand, React Query | 전역 상태 및 서버 상태 관리 |
| **Routing** | React Router DOM | SPA(단일 페이지 애플리케이션) 라우팅 처리 |
| **Form Handling** | React Hook Form, Zod | 폼 상태 관리 및 스키마 기반 유효성 검사 |
| **API Client** | Axios | HTTP 요청 및 응답 처리, 인터셉터를 통한 토큰 관리 |
| **UX/DX** | sonner, next-themes, @tanstack/react-query-devtools | 사용자 피드백, 테마 관리, 개발 도구 |
| **Linting** | ESLint, TypeScript ESLint | 코드 품질 및 일관성 유지 |

## ✨ 주요 기능

### 1. 사용자 인증
- **이메일/비밀번호 가입 및 로그인**: 기본적인 사용자 인증 시스템을 제공합니다.
- **소셜 로그인**: Google, Naver, Kakao 계정을 이용한 간편 로그인을 지원합니다.
- **최초 소셜 로그인 시 닉네임 등록**: 소셜 로그인 사용자가 처음 방문할 경우, 닉네임 설정 페이지로 이동하여 추가 정보를 입력받습니다.
- **JWT 기반 세션 관리**: Access Token과 Refresh Token을 사용하여 안전하고 지속적인 사용자 세션을 관리하며, 자동으로 토큰을 갱신합니다.
- **인증 상태에 따른 UI/UX**: 로그인 여부에 따라 헤더, 네비게이션 바 등 UI가 동적으로 변경됩니다.

#### 소셜 로그인 처리 흐름
1.  사용자가 소셜 로그인 버튼(Google, Naver, Kakao)을 클릭하면 백엔드 로그인 페이지로 리디렉션됩니다.
2.  로그인 성공 시, 백엔드는 클라이언트의 `/cookie` 경로로 리디렉션하며, 응답 헤더에 `httpOnly` 쿠키를 설정합니다.
3.  `CookiePage` 컴포넌트는 마운트 시 `/jwt/exchange` 엔드포인트로 요청을 보내 백엔드로부터 JWT Access Token을 발급받습니다.
4.  발급받은 토큰으로 사용자 정보를 조회하고, 전역 상태(Zustand)에 저장합니다.
5.  만약 사용자 정보에 `needsNickname: true` 필드가 포함되어 있다면, `/nickname` 페이지로 이동하여 사용자에게 닉네임 등록을 유도합니다.
6.  닉네임 등록이 필요 없거나 완료된 경우, 메인 페이지(`/`)로 이동하며 환영 메시지를 표시합니다.

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

## 📂 상세 폴더 구조

`src` 디렉토리는 애플리케이션의 핵심 소스 코드를 담고 있으며, 기능별로 모듈화되어 있습니다.

- **`assets`**: 이미지, 폰트 등 정적 파일을 관리합니다.
- **`components`**: 재사용 가능한 React 컴포넌트들을 관리합니다.
    - **`auth`**: 인증 상태에 따라 UI를 제어하는 컴포넌트 (`AuthInitializer`).
    - **`form`**: 로그인, 회원가입 등 다양한 폼 컴포넌트.
    - **`layouts`**: 애플리케이션의 전체적인 레이아웃(헤더, 네비게이션 바, 페이지 구조)을 담당합니다.
    - **`theme`**: 테마(Light/Dark 모드) 전환과 관련된 컴포넌트.
    - **`ui`**: `shadcn/ui`를 기반으로 하는 버튼, 카드, 입력 필드 등 기본적인 UI 요소.
- **`hooks`**: 비즈니스 로직과 상태 로직을 분리하기 위한 커스텀 훅을 관리합니다.
    - **`queries`**: `React Query`를 사용하는 API 요청 훅 (e.g., `useAuthInit`).
    - `useSignUpForm.ts`, `useRegiForm.ts`: 특정 폼의 상태와 로직을 관리하는 훅.
- **`lib`**: 애플리케이션 전반에서 사용되는 라이브러리 및 유틸리티 함수를 관리합니다.
    - **`api`**: `Axios` 인스턴스 설정 및 API 호출을 담당하는 서비스(`UserApi`)를 포함합니다.
    - **`utils.ts`**: 공통으로 사용되는 유틸리티 함수 모음.
    - **`zodSchemas`**: `Zod`를 이용한 데이터 유효성 검사 스키마.
- **`pages`**: `React Router`에 의해 렌더링되는 페이지 단위의 컴포넌트들을 관리합니다.
- **`store`**: `Zustand`를 사용하여 사용자 인증 정보와 같은 전역 상태를 관리합니다.
- **`types`**: 프로젝트 전반에서 사용되는 TypeScript 타입 정의를 관리합니다.

## 📝 문서
- `docs/react-query-guide.md`: React Query 사용법에 대한 가이드입니다.
- `docs/token-rotation-cleanup.md`: 토큰 순환 및 정리에 대한 문서입니다.

## 🧩 코드 특징 및 개선 제안

### 코드 특징
- **관심사 분리 (SoC)**: UI(components), 비즈니스 로직(hooks), API 통신(lib/api), 상태(store)가 명확하게 분리되어 유지보수성이 높습니다.
- **선언적 서버 상태 관리**: `React Query`를 통해 서버 데이터의 `fetching`, `caching`, `synchronizing` 로직을 선언적으로 관리하여 복잡성을 줄입니다.
- **타입 안정성**: `TypeScript`와 `Zod`를 적극적으로 활용하여 컴파일 타임과 런타임 모두에서 데이터의 안정성을 확보합니다.
- **재사용 가능한 폼 관리**: `React Hook Form`과 커스텀 훅을 결합하여 폼 상태 및 유효성 검사 로직을 재사용 가능한 형태로 관리합니다.

### 개선 제안
- **테스트 코드 도입**: 현재 테스트 코드가 부재합니다. `Vitest`나 `React Testing Library`를 도입하여 커스텀 훅과 주요 컴포넌트에 대한 단위/통합 테스트를 추가하면 코드의 안정성과 신뢰도를 크게 향상시킬 수 있습니다.
- **컴포넌트 시각화 도구**: `shadcn/ui` 컴포넌트들을 효과적으로 문서화하고 시각적으로 테스트하기 위해 `Storybook`을 도입하는 것을 고려해볼 수 있습니다.
- **API 서비스 모듈화**: 애플리케이션 규모가 커짐에 따라, `UserApi.ts`와 같은 단일 API 서비스 파일을 기능(도메인)별로 분리(e.g., `AuthApi.ts`, `VoteApi.ts`)하면 책임이 명확해지고 관리가 용이해집니다.
- **커스텀 훅 일반화**: `useRegiForm`과 `useSignUpForm`처럼 유사한 역할을 하는 훅들이 존재합니다. Zod 스키마와 submit 핸들러를 인자로 받는 범용 `useForm` 훅을 만들어 코드 중복을 줄일 수 있습니다.