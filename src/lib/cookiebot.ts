type CookiebotApi = {
  renew?: () => void;
};

declare global {
  interface Window {
    Cookiebot?: CookiebotApi;
  }
}

export function openCookieSettings() {
  if (typeof window === "undefined") {
    return;
  }

  const renew = window.Cookiebot?.renew;
  if (typeof renew === "function") {
    renew();
  }
}
