import { getTranslations } from "next-intl/server";

import styles from "./Faq.module.scss";
import { FAQ_KEYS } from "./faqItems";
import { ChevronIcon } from "./icons";
import shared from "./landing.module.scss";
import SectionHeader from "./SectionHeader";

export default async function Faq() {
  const t = await getTranslations("LandingPage.faq");

  return (
    <section
      id="faq"
      className={`${shared.section} ${shared.sectionAlt}`}
      aria-labelledby="faq-title"
    >
      <div className={shared.container}>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} titleId="faq-title" />

        <div className={styles.list}>
          {FAQ_KEYS.map((key, index) => (
            // Native disclosure: accessible, keyboard friendly and needs no JavaScript.
            <details key={key} className={styles.item} open={index === 0}>
              <summary className={styles.summary}>
                <span>{t(`items.${key}.question`)}</span>
                <span className={styles.chevron}>
                  <ChevronIcon size={18} />
                </span>
              </summary>
              <p className={styles.answer}>{t(`items.${key}.answer`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
