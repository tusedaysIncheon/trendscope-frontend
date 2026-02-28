type CookiebotApi = {
  renew?: () => void;
  show?: () => void;
  showPreferences?: () => void;
  openPreferences?: () => void;
};

type UsercentricsApi = {
  showSecondLayer?: () => void;
};

declare global {
  interface Window {
    Cookiebot?: CookiebotApi;
    UC_UI?: UsercentricsApi;
  }
}

function tryOpenCookieSettings(): boolean {
  const cookiebot = window.Cookiebot;
  const usercentrics = window.UC_UI;

  if (cookiebot?.renew) {
    cookiebot.renew();
    return true;
  }

  if (cookiebot?.showPreferences) {
    cookiebot.showPreferences();
    return true;
  }

  if (cookiebot?.openPreferences) {
    cookiebot.openPreferences();
    return true;
  }

  if (cookiebot?.show) {
    cookiebot.show();
    return true;
  }

  if (usercentrics?.showSecondLayer) {
    usercentrics.showSecondLayer();
    return true;
  }

  return false;
}

export function openCookieSettings() {
  if (typeof window === "undefined") {
    return;
  }

  if (tryOpenCookieSettings()) {
    return;
  }

  // Cookie CMP script can be async-loaded; retry briefly before giving up.
  let retries = 0;
  const timer = window.setInterval(() => {
    retries += 1;
    if (tryOpenCookieSettings() || retries >= 12) {
      window.clearInterval(timer);
      if (retries >= 12) {
        console.warn("Cookie settings dialog API not available yet.");
      }
    }
  }, 200);
}
