import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@/shared/theme/theme-provider"
import AppLayout from "@/shared/layouts/AppLayout"
import AuthInitializer from "@/features/auth/components/AuthInitializer"
import { AppErrorBoundary } from "@/shared/components/AppErrorBoundary";

import IndexPage from "./pages/index/IndexPage";
import LoginPage from "./pages/auth/LoginPage";
import EmailOtpLoginPage from "./pages/auth/EmailOtpLoginPage";
import EmailOtpVerifyPage from "./pages/auth/EmailOtpVerifyPage";
import CookiePage from "./pages/cookie/CookiePage";
import ProfileSetupPage from "./pages/auth/ProfileSetupPage";
import PaymentPage from "./pages/payment/PaymentPage";
import PaymentSuccessPage from "./pages/payment/PaymentSuccessPage";
import MyPagePage from "./pages/mypage/MyPagePage";
import MeasurementInfoPage from "./pages/measurement/MeasurementInfoPage";
import MeasurementPhotoPage from "./pages/measurement/MeasurementPhotoPage";
import MeasurementSidePhotoPage from "./pages/measurement/MeasurementSidePhotoPage";
import MeasurementAnalyzingPage from "./pages/measurement/MeasurementAnalyzingPage";
import MeasurementResultPage from "./pages/measurement/MeasurementResultPage";
import MeasurementSharedResultPage from "./pages/measurement/MeasurementSharedResultPage";
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage";
import TermsPage from "./pages/legal/TermsPage";
import RefundPolicyPage from "./pages/legal/RefundPolicyPage";
import HelpPage from "./pages/help/HelpPage";

import LayoutGuidePage from "./pages/examples/LayoutGuidePage";


function AppRoutes() {



  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />

      {/* [그룹 1] 로그인 후 보여질 메인 화면들 
        AppLayout(헤더+사이드바)이 적용됨 
      */}
      <Route element={<AppLayout />}>
        <Route path="/explore" element={<div>탐색 페이지</div>} />
        <Route path="/messages" element={<div>메시지 페이지</div>} />

      </Route>

      {/* [그룹 2] 전체 화면 페이지들 (로그인, 회원가입 등)
        헤더나 사이드바 없이 꽉 찬 화면으로 나옴
      */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/email-otp" element={<EmailOtpLoginPage />} />
      <Route path="/login/email-otp/verify" element={<EmailOtpVerifyPage />} />
      <Route path="/signup" element={<Navigate to="/login" replace />} />
      <Route path="/cookie" element={<CookiePage />} />
      <Route path="/profile-setup" element={<ProfileSetupPage />} />
      <Route path="/profile" element={<MyPagePage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/measure/info" element={<MeasurementInfoPage />} />
      <Route path="/measure/photos" element={<MeasurementPhotoPage />} />
      <Route path="/measure/photos/side" element={<MeasurementSidePhotoPage />} />
      <Route path="/measure/analyzing/:jobId" element={<MeasurementAnalyzingPage />} />
      <Route path="/measure/result/:jobId" element={<MeasurementResultPage />} />
      <Route path="/share/result/:shareToken" element={<MeasurementSharedResultPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/refund-policy" element={<RefundPolicyPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/dev/layout-guide" element={<LayoutGuidePage />} />

    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AppErrorBoundary>
          <AuthInitializer>
            <AppRoutes />
          </AuthInitializer>
        </AppErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  )
}
