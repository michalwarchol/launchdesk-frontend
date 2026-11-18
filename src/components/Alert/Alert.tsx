import { useTranslations } from "next-intl";

import styles from "./Alert.module.scss";

interface AlertProps {
  children: React.ReactNode;
  variant?: "error" | "info";
  role?: "alert" | "status";
  className?: string;
}

export default function Alert({ children, variant = "error", role, className }: AlertProps) {
  const t = useTranslations("Alert");
  const alertRole = role ?? (variant === "info" ? "status" : "alert");
  const alertClassName = [styles.alert, styles[variant], className].filter(Boolean).join(" ");

  return (
    <div role={alertRole} className={alertClassName}>
      {variant === "info" ? (
        <svg
          className={styles.icon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ) : (
        <svg
          className={styles.icon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )}
      <span>
        <span className={styles.visuallyHidden}>
          {variant === "info" ? t("infoPrefix") : t("errorPrefix")}
        </span>
        {children}
      </span>
    </div>
  );
}
