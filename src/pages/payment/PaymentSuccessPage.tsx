import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { queryKeys } from "@/lib/queryKeys";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useI18n();

  useEffect(() => {
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.root }),
      queryClient.invalidateQueries({ queryKey: queryKeys.mypage.root }),
      queryClient.invalidateQueries({ queryKey: queryKeys.user }),
    ]);
  }, [queryClient]);

  return (
    <div className="font-['Inter',sans-serif] min-h-screen w-full bg-background">
      <LandingHeader ctaPath="/profile" ctaLabelKey="common.myPage" />

      <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-[1200px] items-center justify-center px-4 py-10 sm:px-6 md:px-8">
        <Card className="w-full max-w-[520px] rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">{t("payment.successTitle")}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t("payment.successDescription")}</p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button className="h-11 flex-1 font-bold" onClick={() => navigate("/", { replace: true })}>
              {t("payment.goHome")}
            </Button>
            <Button
              variant="outline"
              className="h-11 flex-1 border-slate-200 font-bold text-slate-700"
              onClick={() => navigate("/profile", { replace: true })}
            >
              {t("common.myPage")}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
