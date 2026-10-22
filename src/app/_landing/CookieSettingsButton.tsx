"use client";

import { useTranslations } from "next-intl";

import { openCookieConsentSettings } from "@/lib/analytics/consent";

import styles from "./LandingFooter.module.scss";

export default function CookieSettingsButton() {
  const t = useTranslations("LandingPage.cookies");

  return (
    <button type="button" className={styles.link} onClick={openCookieConsentSettings}>
      {t("settings")}
    </button>
  );
}
