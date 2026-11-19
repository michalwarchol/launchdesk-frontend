import { useTranslations } from "next-intl";

import styles from "./LoadingStatus.module.scss";

interface LoadingStatusProps {
  message?: string;
}

export default function LoadingStatus({ message }: LoadingStatusProps) {
  const t = useTranslations("Common");

  return (
    <div className={styles.status} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.visuallyHidden}>{message ?? t("loading")}</span>
    </div>
  );
}
