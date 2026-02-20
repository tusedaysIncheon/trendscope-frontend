import { Mail } from "lucide-react";
import { SiNaver } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/shared/ui/card";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleSocialLogin = (provider: "naver" | "google") => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="font-['Inter',sans-serif] flex min-h-screen w-full items-center justify-center bg-background px-0">
      <div className="flex min-h-screen w-full max-w-[480px] flex-col border-x border-border bg-background text-foreground shadow-xl shadow-slate-300/40 lg:max-w-none lg:border-x-0 lg:shadow-none">
        <LandingHeader showCta={false} />

        <main className="flex flex-1 items-start justify-center px-0 pb-8 pt-24">
          <div className="w-full max-w-[420px]">
            <div className="mb-9 text-center">
              <h1 className="p-[20px] text-[2.05rem] font-black leading-[1.15] tracking-tight text-slate-900">
                {t("loginPage.welcomeLine1")}
                <br />
                {t("loginPage.welcomeLine2")}
              </h1>
            </div>

            <Card className="gap-3 rounded-3xl border border-border bg-white p-4 shadow-lg shadow-slate-200/40">
              <button
                type="button"
                onClick={() => handleSocialLogin("naver")}
                className="relative flex h-14 w-full items-center justify-center rounded-full bg-[#03C75A] text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#02b351] active:scale-[0.99]"
              >
                <span className="absolute left-6 flex items-center">
                  <SiNaver className="text-base" />
                </span>
                <span>{t("loginPage.continueNaver")}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="relative flex h-14 w-full items-center justify-center rounded-full border border-slate-200 bg-white text-[15px] font-semibold text-slate-900 transition-all duration-200 hover:bg-slate-50 active:scale-[0.99]"
              >
                <span className="absolute left-6 flex items-center">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </span>
                <span>{t("loginPage.continueGoogle")}</span>
              </button>

              <div className="my-1 flex items-center gap-3 opacity-70">
                <div className="h-px flex-1 bg-slate-300" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t("loginPage.or")}
                </span>
                <div className="h-px flex-1 bg-slate-300" />
              </div>

              <button
                type="button"
                onClick={() => {
                  navigate("/login/email-otp", { replace: true });
                }}
                className="relative flex h-14 w-full items-center justify-center rounded-full border border-primary bg-transparent text-[15px] font-semibold text-primary transition-all duration-200 hover:bg-primary/5 active:scale-[0.99]"
              >
                <span className="absolute left-6 flex items-center text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <span>{t("loginPage.emailOtp")}</span>
              </button>
            </Card>

            <div className="mt-6 text-center">
              <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-500">
                {t("loginPage.termsPrefix")}{" "}
                <Link to="/terms" className="text-primary transition-colors hover:text-blue-600 hover:underline">
                  {t("common.terms")}
                </Link>{" "}
                {t("loginPage.and")}{" "}
                <Link to="/privacy" className="text-primary transition-colors hover:text-blue-600 hover:underline">
                  {t("common.privacy")}
                </Link>
                {t("loginPage.termsSuffix")}
              </p>
            </div>
          </div>
        </main>

        <footer className="hidden w-full py-6 text-center text-sm text-slate-400 md:block">
          © 2026 Trendscope Inc.
        </footer>
      </div>
    </div>
  );
}
