import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@/shared/theme/theme-provider"
import AppLayout from "@/shared/layouts/AppLayout"
import AuthInitializer from "@/features/auth/components/AuthInitializer"

import IndexPage from "./pages/index/IndexPage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import CookiePage from "./pages/cookie/CookiePage";
import ProfileSetupPage from "./pages/auth/ProfileSetupPage";
import CreateVotePage from "./pages/vote/CreateVotePage";
import LayoutGuidePage from "./pages/examples/LayoutGuidePage";


function AppRoutes() {



  return (
    <Routes>
      {/* [그룹 1] 로그인 후 보여질 메인 화면들 
        AppLayout(헤더+사이드바)이 적용됨 
      */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<IndexPage />} />
        <Route path="/explore" element={<div>탐색 페이지</div>} />
        <Route path="/messages" element={<div>메시지 페이지</div>} />
        <Route path="/profile" element={<div>프로필 페이지</div>} />
        <Route path="/vote/create" element={<CreateVotePage />} />
      </Route>

      {/* [그룹 2] 전체 화면 페이지들 (로그인, 회원가입 등)
        헤더나 사이드바 없이 꽉 찬 화면으로 나옴
      */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/cookie" element={<CookiePage />} />
      <Route path="/profile-setup" element={<ProfileSetupPage />} />
      <Route path="/dev/layout-guide" element={<LayoutGuidePage />} />

    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AuthInitializer>
          <AppRoutes />
        </AuthInitializer>
      </BrowserRouter>
    </ThemeProvider>
  )
}