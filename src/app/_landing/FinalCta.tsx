import { getTranslations } from "next-intl/server";

import { LOGIN_PATH, REGISTER_PATH } from "@/lib/auth/routes";

import CtaLink from "./CtaLink";
import styles from "./FinalCta.module.scss";
import shared from "./landing.module.scss";

export default async function FinalCta() {
  const t = await getTranslations("LandingPage.finalCta");

  return (
    <section className={shared.section} aria-labelledby="final-cta-title">
      <div className={shared.container}>
        <div className={styles.banner}>
          <h2 id="final-cta-title" className={styles.title}>
            {t("title")}
          </h2>
          <p className={styles.subtitle}>{t("subtitle")}</p>
          <div className={styles.actions}>
            <CtaLink href={REGISTER_PATH}>{t("signUp")}</CtaLink>
            <CtaLink href={LOGIN_PATH} variant="outline">
              {t("signIn")}
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
