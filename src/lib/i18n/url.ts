import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type Language } from "./translations";

const LOCALIZED_PUBLIC_PATHS = new Set([
  "/",
  "/help",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/open-source-notices",
]);

function normalizePath(pathname: string) {
  if (!pathname) return "/";
  const onlyPath = pathname.split("?")[0].split("#")[0];
  const withLeadingSlash = onlyPath.startsWith("/") ? onlyPath : `/${onlyPath}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/");
  return collapsed.length > 1 && collapsed.endsWith("/") ? collapsed.slice(0, -1) : collapsed;
}

export function isSupportedLanguage(value: string | null | undefined): value is Language {
  return !!value && SUPPORTED_LANGUAGES.includes(value as Language);
}

export function getPathLanguage(pathname: string): Language | null {
  const normalized = normalizePath(pathname);
  const firstSegment = normalized.split("/").filter(Boolean)[0] ?? null;
  return isSupportedLanguage(firstSegment) ? firstSegment : null;
}

export function stripLanguagePrefix(pathname: string): string {
  const normalized = normalizePath(pathname);
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) return "/";

  const [first, ...rest] = segments;
  if (!isSupportedLanguage(first)) {
    return normalized;
  }

  if (rest.length === 0) return "/";
  return `/${rest.join("/")}`;
}

export function withLanguagePrefix(pathname: string, language: Language = DEFAULT_LANGUAGE): string {
  const stripped = stripLanguagePrefix(pathname);
  if (stripped === "/") {
    return `/${language}`;
  }
  return `/${language}${stripped}`;
}

export function isLocalizedPublicPath(pathname: string): boolean {
  const stripped = stripLanguagePrefix(pathname);
  return LOCALIZED_PUBLIC_PATHS.has(stripped);
}

