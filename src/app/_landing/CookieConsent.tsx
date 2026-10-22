"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import {
  clearGaCookies,
  OPEN_COOKIE_CONSENT_EVENT,
  setAnalyticsConsentCookie,
  type AnalyticsConsent,
} from "@/lib/analytics/consent";

import styles from "./CookieConsent.module.scss";
import shared from "./landing.module.scss";

interface CookieConsentProps {
  initialConsent: AnalyticsConsent | undefined;
  measurementId: string;
}

export default function CookieConsent({ initialConsent, measurementId }: CookieConsentProps) {
  const t = useTranslations("LandingPage.cookies");
  const [consent, setConsent] = useState<AnalyticsConsent | undefined>(initialConsent);
  const [bannerOpen, setBannerOpen] = useState(initialConsent === undefined);

  useEffect(() => {
    const onOpen = () => setBannerOpen(true);
    window.addEventListener(OPEN_COOKIE_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_COOKIE_CONSENT_EVENT, onOpen);
  }, []);

  const applyChoice = useCallback(
    (next: AnalyticsConsent) => {
      const previous = consent ?? initialConsent;

      setAnalyticsConsentCookie(next);
      if (next === "denied") clearGaCookies();

      if (previous !== undefined && previous !== next) {
        window.location.reload();
        return;
      }

      setConsent(next);
      setBannerOpen(false);
    },
    [consent, initialConsent],
  );

  return (
    <>
      {consent === "granted" ? <GoogleAnalytics gaId={measurementId} /> : null}
      {bannerOpen ? (
        <div className={styles.banner} role="dialog" aria-labelledby="cookie-consent-message">
          <div className={`${shared.container} ${styles.inner}`}>
            <p id="cookie-consent-message" className={styles.message}>{t("message")}</p>
            <div className={styles.actions}>
              <Button variant="outline" size="sm" onClick={() => applyChoice("denied")}>
                {t("reject")}
              </Button>
              <Button size="sm" onClick={() => applyChoice("granted")}>
                {t("accept")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
