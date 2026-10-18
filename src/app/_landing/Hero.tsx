import { getTranslations } from "next-intl/server";

import { LOGIN_PATH, REGISTER_PATH } from "@/lib/auth/routes";

import CtaLink from "./CtaLink";
import styles from "./Hero.module.scss";
import shared from "./landing.module.scss";
import ProductPreview from "./ProductPreview";

export default async function Hero() {
  const t = await getTranslations("LandingPage.hero");

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`${shared.container} ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={shared.eyebrow}>{t("eyebrow")}</span>
          <h1 id="hero-title" className={styles.title}>
            {t("title")}
          </h1>
          <p className={styles.subtitle}>{t("subtitle")}</p>

          <div className={styles.actions}>
            <CtaLink href={REGISTER_PATH}>{t("signUp")}</CtaLink>
            <CtaLink href={LOGIN_PATH} variant="outline">
              {t("signIn")}
            </CtaLink>
          </div>

          <p className={styles.trust}>{t("trust")}</p>
        </div>

        <ProductPreview />
      </div>
    </section>
  );
}
