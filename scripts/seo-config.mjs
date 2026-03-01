export const SITE_URL = process.env.SEO_SITE_URL?.trim() || "https://trend-scope.net";

export const LANGUAGES = ["ko", "en", "ja", "zh"];

export const PUBLIC_PATHS = [
  { path: "/", changefreq: "daily" },
  { path: "/help", changefreq: "monthly" },
  { path: "/privacy", changefreq: "monthly" },
  { path: "/terms", changefreq: "monthly" },
  { path: "/refund-policy", changefreq: "monthly" },
  { path: "/open-source-notices", changefreq: "monthly" },
];

const ROOT_PRIORITY_BY_LANGUAGE = {
  ko: "1.0",
  en: "0.9",
  ja: "0.9",
  zh: "0.9",
};

const HELP_PRIORITY_BY_LANGUAGE = {
  ko: "0.7",
  en: "0.6",
  ja: "0.6",
  zh: "0.6",
};

const DEFAULT_PRIORITY_BY_PATH = {
  "/privacy": "0.5",
  "/terms": "0.5",
  "/refund-policy": "0.5",
  "/open-source-notices": "0.4",
};

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function withLanguagePrefix(language, pathname) {
  const normalized = normalizePath(pathname);
  if (normalized === "/") return `/${language}`;
  return `/${language}${normalized}`;
}

export function toAbsoluteUrl(pathname) {
  const base = trimTrailingSlash(SITE_URL);
  const normalized = normalizePath(pathname);
  return `${base}${normalized}`;
}

export function resolvePriority(language, pathname) {
  const normalized = normalizePath(pathname);

  if (normalized === "/") {
    return ROOT_PRIORITY_BY_LANGUAGE[language] || "0.8";
  }

  if (normalized === "/help") {
    return HELP_PRIORITY_BY_LANGUAGE[language] || "0.6";
  }

  return DEFAULT_PRIORITY_BY_PATH[normalized] || "0.5";
}
