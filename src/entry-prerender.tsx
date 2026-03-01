import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import type { Language } from "@/lib/i18n/translations";
import { getPathLanguage, stripLanguagePrefix, withLanguagePrefix } from "@/lib/i18n/url";
import HelpPage from "@/pages/help/HelpPage";
import IndexPage from "@/pages/index/IndexPage";
import OpenSourceNoticesPage from "@/pages/legal/OpenSourceNoticesPage";
import PrivacyPolicyPage from "@/pages/legal/PrivacyPolicyPage";
import RefundPolicyPage from "@/pages/legal/RefundPolicyPage";
import TermsPage from "@/pages/legal/TermsPage";

const PRERENDER_LANGUAGES: Language[] = ["ko", "en", "ja", "zh"];
const PUBLIC_PATHS = ["/", "/help", "/privacy", "/terms", "/refund-policy", "/open-source-notices"] as const;

function createPrerenderQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        enabled: false,
        retry: false,
      },
    },
  });
}

function resolveRouteElement(routePath: string) {
  switch (stripLanguagePrefix(routePath)) {
    case "/":
      return <IndexPage />;
    case "/help":
      return <HelpPage />;
    case "/privacy":
      return <PrivacyPolicyPage />;
    case "/terms":
      return <TermsPage />;
    case "/refund-policy":
      return <RefundPolicyPage />;
    case "/open-source-notices":
      return <OpenSourceNoticesPage />;
    default:
      throw new Error(`Unsupported prerender path: ${routePath}`);
  }
}

export function getPrerenderRoutePaths() {
  return PRERENDER_LANGUAGES.flatMap((language) =>
    PUBLIC_PATHS.map((publicPath) => withLanguagePrefix(publicPath, language))
  );
}

export function renderForPrerender(routePath: string) {
  const language = getPathLanguage(routePath) ?? "ko";
  const helmetContext: { helmet?: any } = {};
  const queryClient = createPrerenderQueryClient();

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <I18nProvider initialLanguage={language}>
          <MemoryRouter initialEntries={[routePath]}>{resolveRouteElement(routePath)}</MemoryRouter>
        </I18nProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );

  queryClient.clear();

  return {
    appHtml,
    titleTag: helmetContext.helmet?.title.toString() ?? "",
    headTags: `${helmetContext.helmet?.meta.toString() ?? ""}${helmetContext.helmet?.link.toString() ?? ""}${helmetContext.helmet?.script.toString() ?? ""}`,
  };
}
