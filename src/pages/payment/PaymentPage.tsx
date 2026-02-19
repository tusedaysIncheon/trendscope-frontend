import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  CheckCircle2,
  History,
  Lock,
  Ticket,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useAuthStore } from "@/store/useAuthStore";
import { LandingHeader } from "@/shared/layouts/headers/LandingHeader";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { createCreemCheckout } from "@/features/payment/api/creem.api";
import { useTicketSummary } from "@/features/tickets/hooks/useTicket";
import { getApiErrorMessage } from "@/lib/api/error";
import type { TicketType } from "@/types/trendscope";

const TICKET_PRICES: Record<TicketType, number> = {
  QUICK: 1.99,
  PREMIUM: 5.99,
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: ticketSummary } = useTicketSummary();

  const [selectedTicketType, setSelectedTicketType] = useState<TicketType>("QUICK");
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const selectedPrice = useMemo(() => TICKET_PRICES[selectedTicketType], [selectedTicketType]);
  const totalAmount = useMemo(() => selectedPrice, [selectedPrice]);

  const handleCheckout = async () => {
    try {
      setIsCheckoutPending(true);
      const successUrl = `${window.location.origin}/payment/success`;
      const response = await createCreemCheckout({
        ticketType: selectedTicketType,
        successUrl,
      });
      window.location.href = response.checkoutUrl;
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("payment.checkoutError")));
      setIsCheckoutPending(false);
    }
  };

  return (
    <div className="font-['Inter',sans-serif] min-h-screen w-full bg-background">
      <LandingHeader ctaPath="/profile" ctaLabelKey="common.myPage" />

      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 md:px-8">
        <div className="mx-auto flex w-full max-w-[620px] flex-col gap-7">
          <section className="space-y-2 text-center">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{t("payment.title")}</h1>
            <p className="text-base font-medium text-slate-500 sm:text-lg">{t("payment.subtitle")}</p>
          </section>

          <Card className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-blue-200/30 blur-3xl" />
            <div className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2">
              <div className="row-span-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 text-primary shadow-sm sm:h-14 sm:w-14">
                <Ticket className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <p className="min-w-0 truncate text-xs font-bold uppercase tracking-wider text-slate-500">
                {t("payment.availableBalance")}
              </p>
              <Button
                variant="outline"
                className="h-9 self-start rounded-xl border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                onClick={() => navigate("/profile")}
              >
                <History className="mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4" />
                {t("payment.history")}
              </Button>
              <div className="col-span-2 col-start-2 mt-0.5 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pr-1">
                    <span className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 to-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-sm sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[11px]">
                      <span className="pointer-events-none absolute -left-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-background" />
                      <span className="pointer-events-none absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-background" />
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-md bg-white text-primary shadow-sm sm:h-5 sm:w-5">
                        <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </span>
                      <span>{t("common.quickTicket")}</span>
                      <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                        {ticketSummary?.quickTicketBalance ?? 0}
                      </span>
                    </span>
                    <span className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-sm sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[11px]">
                      <span className="pointer-events-none absolute -left-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-background" />
                      <span className="pointer-events-none absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-background" />
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-md bg-white text-[#C85E2D] shadow-sm sm:h-5 sm:w-5">
                        <Crown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </span>
                      <span>{t("common.premiumTicket")}</span>
                      <span className="rounded-md bg-[#FA824C] px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                        {ticketSummary?.premiumTicketBalance ?? 0}
                      </span>
                    </span>
              </div>
            </div>
          </Card>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSelectedTicketType("QUICK")}
              className={`group relative min-h-[280px] overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 ${
                selectedTicketType === "QUICK"
                  ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-[0_18px_35px_-24px_rgba(60,145,230,0.85)]"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_30px_-24px_rgba(15,23,42,0.45)]"
              }`}
            >
              {selectedTicketType === "QUICK" && (
                <div className="absolute right-4 top-4 rounded-full bg-white p-1 text-primary shadow-sm">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}

              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-[1.7rem] font-black tracking-tight text-slate-900">{t("payment.quickTitle")}</h3>
              <p className="mt-1 text-sm font-medium text-slate-600">{t("payment.quickDescription")}</p>
              <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-primary/70" />
                  <span>{t("payment.quickDetail1")}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-primary/70" />
                  <span>{t("payment.quickDetail2")}</span>
                </li>
              </ul>
              <div className="mt-5 h-px w-full bg-slate-200/80" />
              <p className="mt-4 text-4xl font-black tracking-tight text-primary">${TICKET_PRICES.QUICK.toFixed(2)}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{t("payment.singlePurchase")}</p>

              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              <div className="pointer-events-none absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-blue-200/25 blur-2xl" />
            </button>

            <button
              type="button"
              onClick={() => setSelectedTicketType("PREMIUM")}
              className={`group relative min-h-[280px] overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 ${
                selectedTicketType === "PREMIUM"
                  ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-[0_18px_35px_-24px_rgba(60,145,230,0.85)]"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_30px_-24px_rgba(15,23,42,0.45)]"
              }`}
            >
              {selectedTicketType === "PREMIUM" && (
                <div className="absolute right-4 top-4 rounded-full bg-white p-1 text-primary shadow-sm">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}

              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FA824C]/15 text-[#C85E2D]">
                <Crown className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-[1.7rem] font-black tracking-tight text-slate-900">{t("payment.premiumTitle")}</h3>
              <p className="mt-1 text-sm font-medium text-slate-600">{t("payment.premiumDescription")}</p>
              <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-[#FA824C]/90" />
                  <span>{t("payment.premiumDetail1")}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-[#FA824C]/90" />
                  <span>{t("payment.premiumDetail2")}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-[#FA824C]/90" />
                  <span>{t("payment.premiumDetail3")}</span>
                </li>
              </ul>
              <div className="mt-5 h-px w-full bg-slate-200/80" />
              <p className="mt-4 text-4xl font-black tracking-tight text-slate-900">${TICKET_PRICES.PREMIUM.toFixed(2)}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{t("payment.singlePurchase")}</p>

              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              <div className="pointer-events-none absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-[#FA824C]/20 blur-2xl" />
            </button>
          </section>

          <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
            <div className="mb-6 flex items-center gap-3 border-b border-dashed border-slate-200 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Ticket className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-black text-slate-900">{t("payment.orderSummary")}</h2>
            </div>

            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {selectedTicketType === "QUICK" ? t("payment.quickTicketItem") : t("payment.premiumTicketItem")}
                    </p>
                    <p className="text-xs font-medium text-slate-500">{t("payment.singlePurchase")}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-900">${selectedPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">{t("payment.totalAmount")}</span>
                <span className="text-2xl font-black text-slate-900">${totalAmount.toFixed(2)}</span>
              </div>
              <Button
                disabled={isCheckoutPending}
                onClick={handleCheckout}
                className="h-14 w-full rounded-xl text-base font-bold shadow-lg shadow-primary/25"
              >
                {isCheckoutPending ? t("payment.checkoutLoading") : t("payment.proceedCheckout")}
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-slate-400">
                <Lock className="h-3.5 w-3.5" />
                {t("payment.ssl")}
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
