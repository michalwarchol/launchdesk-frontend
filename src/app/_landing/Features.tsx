import { getTranslations } from "next-intl/server";

import styles from "./Features.module.scss";
import { CalendarIcon, ChartIcon, FileIcon, ListChecksIcon, PlayIcon, UsersIcon } from "./icons";
import shared from "./landing.module.scss";
import SectionHeader from "./SectionHeader";

const FEATURES = [
  { key: "templates", Icon: ListChecksIcon },
  { key: "documents", Icon: FileIcon },
  { key: "assignments", Icon: CalendarIcon },
  { key: "dashboard", Icon: ChartIcon },
  { key: "roles", Icon: UsersIcon },
  { key: "player", Icon: PlayIcon },
] as const;

export default async function Features() {
  const t = await getTranslations("LandingPage.features");

  return (
    <section id="features" className={shared.section} aria-labelledby="features-title">
      <div className={shared.container}>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          titleId="features-title"
        />

        <ul className={styles.grid}>
          {FEATURES.map(({ key, Icon }) => (
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
