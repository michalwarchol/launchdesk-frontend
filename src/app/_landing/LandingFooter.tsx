import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { setLocale } from "@/app/actions/set-locale";
import { locales } from "@/i18n/config";
import { LOGIN_PATH, REGISTER_PATH } from "@/lib/auth/routes";
import { CONTACT_EMAIL } from "@/lib/site";

import CookieSettingsButton from "./CookieSettingsButton";
import { MailIcon } from "./icons";
import shared from "./landing.module.scss";
import styles from "./LandingFooter.module.scss";
import Logo from "./Logo";

const LOCALE_LABELS: Record<(typeof locales)[number], string> = {
  en: "English",
  pl: "Polski",
};

interface LandingFooterProps {
  showCookieSettings?: boolean;
}

export default async function LandingFooter({ showCookieSettings = false }: LandingFooterProps) {
  const t = await getTranslations("LandingPage.footer");
  const activeLocale = await getLocale();

  return (
    <footer className={styles.footer}>
      <div className={`${shared.container} ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>{t("tagline")}</p>
        </div>

        <nav className={styles.links} aria-label={t("contact")}>
          <a href={`mailto:${CONTACT_EMAIL}`} className={styles.link}>
            <MailIcon size={18} />
            {CONTACT_EMAIL}
          </a>
          <Link href={LOGIN_PATH} className={styles.link}>
            {t("signIn")}
          </Link>
          <Link href={REGISTER_PATH} className={styles.link}>
            {t("signUp")}
          </Link>
          {showCookieSettings ? <CookieSettingsButton /> : null}
        </nav>

        {/* Server-action form: works with JavaScript disabled and ships no client bundle. */}
        <div className={styles.language} role="group" aria-label={t("language")}>
          <span className={styles.languageLabel}>{t("language")}</span>
          <div className={styles.languageButtons}>
            {locales.map((locale) => {
              const isActive = locale === activeLocale;
              const switchLocale = setLocale.bind(null, locale);

              return (
                <form key={locale} action={switchLocale}>
                  <button
                    type="submit"
                    className={[styles.languageButton, isActive ? styles.languageButtonActive : ""]
                      .filter(Boolean)
                      .join(" ")}
                    aria-pressed={isActive}
                    lang={locale}
                  >
                    {LOCALE_LABELS[locale]}
                  </button>
                </form>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`${shared.container} ${styles.bottom}`}>
        <p className={styles.copyright}>{t("copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
