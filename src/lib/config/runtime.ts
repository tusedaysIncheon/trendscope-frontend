const PROD_API_BASE_URL = "https://api.trend-scope.net/trendscope";
const LOCAL_API_BASE_URL = "http://localhost:8080/trendscope";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getBackendApiBaseUrl() {
  const envValue = (import.meta.env.VITE_BACKEND_API_BASE_URL as string | undefined)?.trim();
  if (envValue) {
    return trimTrailingSlash(envValue);
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "trend-scope.net" || host === "www.trend-scope.net") {
      return PROD_API_BASE_URL;
    }
  }

  return LOCAL_API_BASE_URL;
}
