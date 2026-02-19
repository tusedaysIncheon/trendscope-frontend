import { ArrowRight, Edit3, LockKeyhole, Mail } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { requestEmailOtp, verifyEmailOtp } from "@/features/auth/api/emailOtp.api";
import { getUserLoadInfo } from "@/features/user/api/user.api";
import { getApiErrorMessage } from "@/lib/api/error";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { useAuthStore } from "@/store/useAuthStore";

const OTP_LENGTH = 6;
const OTP_EXPIRE_SECONDS = 5 * 60;
const EMAIL_OTP_STORAGE_KEY = "emailOtpTargetEmail";

type LocationState = {
  email?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatCountdown(totalSeconds: number) {
  const safe = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safe % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function EmailOtpVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const initialEmail = useMemo(() => {
    const routeState = (location.state as LocationState | null)?.email?.trim();
    const saved = window.sessionStorage.getItem(EMAIL_OTP_STORAGE_KEY)?.trim();
    return routeState || saved || "";
  }, [location.state]);

  const [email] = useState(initialEmail);
  const [codeDigits, setCodeDigits] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ""));
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRE_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const code = codeDigits.join("");

  useEffect(() => {
    if (!email || !isValidEmail(email)) {
      toast.error(t("emailOtp.invalidEmail"));
      navigate("/login/email-otp", { replace: true });
      return;
    }
    window.sessionStorage.setItem(EMAIL_OTP_STORAGE_KEY, email);
  }, [email, navigate, t]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const fillDigitsFrom = (raw: string, startIndex = 0) => {
    const parsed = raw.replace(/\D/g, "").slice(0, OTP_LENGTH - startIndex).split("");
    if (!parsed.length) {
      return;
    }

    setCodeDigits((prev) => {
      const next = [...prev];
      parsed.forEach((digit, idx) => {
        next[startIndex + idx] = digit;
      });
      return next;
    });

    const focusIndex = Math.min(startIndex + parsed.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      setCodeDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    if (cleaned.length > 1) {
      fillDigitsFrom(cleaned, index);
      return;
    }

    setCodeDigits((prev) => {
      const next = [...prev];
      next[index] = cleaned;
      return next;
    });

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !codeDigits[index] && index > 0) {
      setCodeDigits((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    fillDigitsFrom(event.clipboardData.getData("text"), 0);
  };

  const handleResend = async () => {
    if (isResending || !email) {
      return;
    }
    try {
      setIsResending(true);
      await requestEmailOtp({ email });
      setCodeDigits(Array.from({ length: OTP_LENGTH }, () => ""));
      setSecondsLeft(OTP_EXPIRE_SECONDS);
      inputRefs.current[0]?.focus();
      toast.success(t("emailOtp.requestSuccess"));
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("emailOtp.requestError")));
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (code.length !== OTP_LENGTH) {
      toast.error(t("emailOtp.emptyCode"));
      return;
    }

    try {
      setIsVerifying(true);
      const response = await verifyEmailOtp({ email, code });
      if (!response.accessToken) {
        toast.error(t("emailOtp.verifyError"));
        return;
      }

      setAccessToken(response.accessToken);
      const fullUserInfo = await getUserLoadInfo();
      queryClient.setQueryData(["user"], fullUserInfo);
      window.sessionStorage.removeItem(EMAIL_OTP_STORAGE_KEY);
      toast.success(t("emailOtp.verifySuccess"));
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("emailOtp.verifyError")));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="font-['Inter',sans-serif] flex min-h-screen w-full items-center justify-center bg-background px-0">
      <div className="flex min-h-screen w-full max-w-[480px] flex-col border-x border-border bg-background text-foreground shadow-xl shadow-slate-300/40 lg:max-w-none lg:border-x-0 lg:shadow-none">
        <LandingHeader showCta={false} />

        <main className="relative flex flex-1 items-start justify-center overflow-hidden px-0 pb-12 pt-16">
          <div className="pointer-events-none absolute -top-16 right-[-180px] h-[360px] w-[360px] rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-180px] left-[-160px] h-[320px] w-[320px] rounded-full bg-[#4f8ccc]/10 blur-3xl" />

          <div className="z-10 w-full max-w-[480px] rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_0_8px_-2px_rgba(61,145,230,0.05)] sm:p-8">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h1 className="mb-3 text-[1.9rem] font-bold leading-tight text-slate-900">{t("emailOtp.verifyTitle")}</h1>
              <p className="text-sm text-slate-500 sm:text-base">{t("emailOtp.verifySubtitle")}</p>
            </div>

            <div className="mb-8 flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2">
              <Mail className="h-4 w-4 shrink-0 text-slate-500" />
              <span className="max-w-[190px] truncate text-sm font-medium text-slate-700 sm:max-w-[280px]">{email}</span>
              <button
                type="button"
                onClick={() =>
                  navigate("/login/email-otp", {
                    replace: true,
                    state: { email },
                  })
                }
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition-colors hover:bg-slate-300"
                aria-label={t("emailOtp.editEmail")}
              >
                <Edit3 className="h-3 w-3" />
              </button>
            </div>

            <form className="flex flex-col gap-7" onSubmit={handleVerify}>
              <div className="flex justify-between gap-2 sm:gap-3">
                {codeDigits.map((digit, index) => (
                  <input
                    key={`otp-digit-${index}`}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onPaste={handlePaste}
                    onKeyDown={(event) => handleDigitKeyDown(index, event)}
                    onChange={(event) => handleDigitChange(index, event.target.value)}
                    className="h-12 w-12 rounded-xl border-2 border-slate-200 bg-white text-center text-2xl font-bold text-slate-900 caret-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 sm:h-14 sm:w-14"
                  />
                ))}
              </div>

              <div className="flex flex-col items-center gap-1.5 text-sm">
                <p className="text-slate-500">
                  {t("emailOtp.codeExpiresIn")}
                  <span className="ml-1 font-mono font-semibold text-slate-900">{formatCountdown(secondsLeft)}</span>
                </p>
                <p className="text-slate-500">
                  {t("emailOtp.notReceived")}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="ml-1 font-semibold text-primary transition-colors hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isResending ? t("emailOtp.sending") : t("emailOtp.resend")}
                  </button>
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifying || code.length !== OTP_LENGTH}
                className="mt-1 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-[#2b6cb0] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{isVerifying ? t("emailOtp.verifying") : t("emailOtp.verifyContinue")}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>

            <div className="mt-10 flex justify-center gap-2 opacity-60">
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
