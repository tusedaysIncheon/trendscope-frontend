import { ArrowRight, Info, Mail } from "lucide-react";
import { SiNaver } from "react-icons/si";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { requestEmailOtp } from "@/features/auth/api/emailOtp.api";
import { getApiErrorMessage } from "@/lib/api/error";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;
const EMAIL_OTP_STORAGE_KEY = "emailOtpTargetEmail";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function EmailOtpLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  const initialEmail = useMemo(() => {
    const routeState = (location.state as { email?: string } | null)?.email?.trim();
    const saved = window.sessionStorage.getItem(EMAIL_OTP_STORAGE_KEY)?.trim();
    return routeState || saved || "";
  }, [location.state]);

  const [email, setEmail] = useState(initialEmail);
  const [isSending, setIsSending] = useState(false);

  const handleSocialLogin = (provider: "naver" | "google") => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  const handleRequestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      toast.error(t("emailOtp.invalidEmail"));
      return;
    }

    try {
      setIsSending(true);
      const normalizedEmail = email.trim();
      await requestEmailOtp({ email: normalizedEmail });
      window.sessionStorage.setItem(EMAIL_OTP_STORAGE_KEY, normalizedEmail);
      toast.success(t("emailOtp.requestSuccess"));
      navigate("/login/email-otp/verify", {
        state: { email: normalizedEmail },
        replace: true,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("emailOtp.requestError")));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="font-['Inter',sans-serif] flex min-h-screen w-full items-center justify-center bg-background px-0">
      <div className="flex min-h-screen w-full max-w-[480px] flex-col border-x border-border bg-background text-foreground shadow-xl shadow-slate-300/40 lg:max-w-none lg:border-x-0 lg:shadow-none">
        <LandingHeader showCta={false} />

        <main className="flex flex-1 items-start justify-center px-0 pb-8 pt-16">
          <div className="w-full max-w-[480px] rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_0_8px_-2px_rgba(61,145,230,0.05)] sm:p-10">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {t("emailOtp.title")}
              </h1>
              <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
                {t("emailOtp.subtitle")}
              </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleRequestOtp}>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="ml-1 text-sm font-semibold text-slate-700">
                  {t("emailOtp.emailLabel")}
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t("emailOtp.emailPlaceholder")}
                    className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSending}
                  />
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{isSending ? t("emailOtp.sending") : t("emailOtp.sendButton")}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-1 flex items-start gap-2 rounded-lg bg-slate-50 p-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p className="text-xs leading-normal text-slate-500">
                  {t("emailOtp.noticeLine1")}
                  <br />
                  {t("emailOtp.noticeLine2")}
                </p>
              </div>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-slate-500">{t("emailOtp.orContinue")}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 text-[12px] font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:gap-2 sm:px-4 sm:text-sm"
              >
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
                <span className="whitespace-nowrap leading-none">{t("loginPage.continueGoogle")}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("naver")}
                className="flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 text-[12px] font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:gap-2 sm:px-4 sm:text-sm"
              >
                <SiNaver className="text-sm text-[#03C75A]" />
                <span className="whitespace-nowrap leading-none">{t("loginPage.continueNaver")}</span>
              </button>
            </div>
          </div>
        </main>

        <div className="px-6 pb-8 text-center">
          <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-400">
            {t("emailOtp.agreePrefix")}{" "}
            <a href="#" className="text-primary hover:underline">
              {t("common.terms")}
            </a>{" "}
            {t("loginPage.and")}{" "}
            <a href="#" className="text-primary hover:underline">
              {t("common.privacy")}
            </a>
            {t("loginPage.termsSuffix")}
          </p>
        </div>
      </div>
    </div>
  );
}
