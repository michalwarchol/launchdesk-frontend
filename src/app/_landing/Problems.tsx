import { getTranslations } from "next-intl/server";

import { ClockIcon, EyeOffIcon, FolderIcon, RepeatIcon } from "./icons";
import shared from "./landing.module.scss";
import styles from "./Problems.module.scss";
import SectionHeader from "./SectionHeader";

const PROBLEMS = [
  { key: "visibility", Icon: EyeOffIcon },
  { key: "documents", Icon: FolderIcon },
  { key: "repetition", Icon: RepeatIcon },
  { key: "delays", Icon: ClockIcon },
] as const;

export default async function Problems() {
  const t = await getTranslations("LandingPage.problems");

  return (
    <section id="problems" className={shared.section} aria-labelledby="problems-title">
      <div className={shared.container}>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          titleId="problems-title"
        />

        <ul className={styles.grid}>
          {PROBLEMS.map(({ key, Icon }) => (
            <li key={key} className={shared.card}>
              <span className={shared.cardIcon}>
                <Icon />
              </span>
              <h3 className={shared.cardTitle}>{t(`items.${key}.title`)}</h3>
              <p className={shared.cardText}>{t(`items.${key}.description`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
