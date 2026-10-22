export const ANALYTICS_CONSENT_COOKIE = "analytics_consent";

export type AnalyticsConsent = "granted" | "denied";

const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export const OPEN_COOKIE_CONSENT_EVENT = "launchdesk:cookie-consent-open";

export function parseAnalyticsConsent(value: string | undefined): AnalyticsConsent | undefined {
  if (value === "granted" || value === "denied") return value;
  return undefined;
}

export function setAnalyticsConsentCookie(value: AnalyticsConsent) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${value}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function clearGaCookies() {
  const host = window.location.hostname;
  const domains = [undefined, host, `.${host}`];

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (!name?.startsWith("_ga")) continue;

    for (const domain of domains) {
      const domainPart = domain ? `; Domain=${domain}` : "";
      document.cookie = `${name}=; Path=/; Max-Age=0${domainPart}`;
    }
  }
}

export function openCookieConsentSettings() {
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_CONSENT_EVENT));
}
