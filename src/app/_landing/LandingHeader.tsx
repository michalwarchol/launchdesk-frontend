import { getTranslations } from "next-intl/server";

import { LOGIN_PATH, REGISTER_PATH } from "@/lib/auth/routes";

import CtaLink from "./CtaLink";
import shared from "./landing.module.scss";
import styles from "./LandingHeader.module.scss";
import Logo from "./Logo";

const ANCHORS = [
  { key: "problems", href: "#problems" },
  { key: "howItWorks", href: "#how-it-works" },
  { key: "features", href: "#features" },
  { key: "faq", href: "#faq" },
] as const;

export default async function LandingHeader() {
  const t = await getTranslations("LandingPage.nav");

  return (
    <header className={styles.header}>
      <div className={`${shared.container} ${styles.inner}`}>
        <Logo priority />

        <nav className={styles.nav} aria-label={t("ariaLabel")}>
          <ul className={styles.links}>
            {ANCHORS.map((anchor) => (
              <li key={anchor.key}>
                <a href={anchor.href} className={styles.link}>
                  {t(anchor.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <CtaLink href={LOGIN_PATH} variant="outline" size="md" className={styles.signIn}>
            {t("signIn")}
          </CtaLink>
          <CtaLink href={REGISTER_PATH} size="md">
            {t("signUp")}
          </CtaLink>
        </div>
      </div>
    </header>
  );
}
