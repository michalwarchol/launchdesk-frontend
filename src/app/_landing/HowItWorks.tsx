import { getTranslations } from "next-intl/server";

import styles from "./HowItWorks.module.scss";
import shared from "./landing.module.scss";
import SectionHeader from "./SectionHeader";

const STEPS = ["templates", "invite", "assign", "track"] as const;

export default async function HowItWorks() {
  const t = await getTranslations("LandingPage.howItWorks");

  return (
    <section
      id="how-it-works"
      className={`${shared.section} ${shared.sectionAlt}`}
      aria-labelledby="how-it-works-title"
    >
      <div className={shared.container}>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          titleId="how-it-works-title"
        />

        <ol className={styles.steps}>
          {STEPS.map((key, index) => (
            <li key={key} className={styles.step}>
              <span className={styles.number} aria-hidden="true">
                {index + 1}
              </span>
              <div className={styles.body}>
                <h3 className={shared.cardTitle}>{t(`steps.${key}.title`)}</h3>
                <p className={shared.cardText}>{t(`steps.${key}.description`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
