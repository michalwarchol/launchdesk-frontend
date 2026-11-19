import { useTranslations } from "next-intl";

import styles from "./LoadingStatus.module.scss";

export default function LoadingStatus() {
  const t = useTranslations("Common");

  return (
    <div className={styles.status} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.visuallyHidden}>{t("loading")}</span>
    </div>
  );
}
