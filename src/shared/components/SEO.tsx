import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/translations";
import { getPathLanguage, isLocalizedPublicPath, stripLanguagePrefix, withLanguagePrefix } from "@/lib/i18n/url";

interface SEOProps {
  title: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
  noindex?: boolean;
}

const DEFAULT_SITE_URL = "https://trend-scope.net";
const DEFAULT_DESCRIPTION =
  "스마트폰 사진 2장으로 내 몸을 3D로 측정하고 완벽한 핏의 패션을 추천받으세요. TrendScope AI 코디네이터.";
const DEFAULT_OG_IMAGE = "/logo1.png";
const OG_LOCALE_MAP: Record<string, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};
const HREFLANG_MAP: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function resolveSiteUrl() {
  const envValue = (import.meta as { env?: { VITE_SITE_URL?: string } }).env?.VITE_SITE_URL?.trim();
  if (envValue) {
    return trimTrailingSlash(envValue);
  }
  return DEFAULT_SITE_URL;
}

function toAbsoluteUrl(url: string, siteUrl: string) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const path = url.startsWith("/") ? url : `/${url}`;
  return `${siteUrl}${path}`;
}

function resolveOgLocale(pathname: string) {
  const pathLanguage = getPathLanguage(pathname);
  if (pathLanguage) {
    return OG_LOCALE_MAP[pathLanguage] ?? OG_LOCALE_MAP.ko;
  }

  if (typeof document === "undefined") {
    return OG_LOCALE_MAP.ko;
  }

  const lang = (document.documentElement.lang || "ko").toLowerCase();
  return OG_LOCALE_MAP[lang] ?? OG_LOCALE_MAP.ko;
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage = DEFAULT_OG_IMAGE,
  ogUrl,
  canonicalUrl,
  structuredData,
  noindex = false,
}: SEOProps) {
  const location = useLocation();
  const siteUrl = resolveSiteUrl();
  const pagePath = location.pathname || "/";
  const normalizedPublicPath = stripLanguagePrefix(pagePath);
  const resolvedCanonicalUrl = toAbsoluteUrl(canonicalUrl ?? pagePath, siteUrl);
  const resolvedOgUrl = toAbsoluteUrl(ogUrl ?? pagePath, siteUrl);
  const resolvedOgImage = toAbsoluteUrl(ogImage, siteUrl);
  const robots = noindex ? "noindex, nofollow" : "index, follow";
  const ogLocale = resolveOgLocale(pagePath);
  const shouldRenderHreflang = !noindex && isLocalizedPublicPath(pagePath);

  const structuredDataScripts = structuredData
    ? (Array.isArray(structuredData) ? structuredData : [structuredData])
    : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={resolvedCanonicalUrl} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:url" content={resolvedOgUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TrendScope" />
      <meta property="og:locale" content={ogLocale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />

      {shouldRenderHreflang &&
        SUPPORTED_LANGUAGES.map((lang) => (
          <link
            key={`alt-${lang}`}
            rel="alternate"
            hrefLang={HREFLANG_MAP[lang]}
            href={toAbsoluteUrl(withLanguagePrefix(normalizedPublicPath, lang), siteUrl)}
          />
        ))}
      {shouldRenderHreflang && (
        <link
          rel="alternate"
          hrefLang="x-default"
          href={toAbsoluteUrl(withLanguagePrefix(normalizedPublicPath, "ko"), siteUrl)}
        />
      )}

      {structuredDataScripts.map((schema, index) => (
        <script key={`seo-schema-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
