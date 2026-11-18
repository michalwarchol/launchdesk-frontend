import { useTranslations } from "next-intl";

import styles from "./StatCard.module.scss";

export type StatCardTone = "default" | "danger" | "success";

export interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  tone?: StatCardTone;
  className?: string;
}

export default function StatCard({
  label,
  value,
  hint,
  tone = "default",
  className,
}: StatCardProps) {
  const t = useTranslations("StatCard");
  const rootClassName = [styles.card, styles[tone], className].filter(Boolean).join(" ");
  const toneText = tone === "danger" ? t("danger") : tone === "success" ? t("success") : null;

  return (
    <dl className={rootClassName}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>
        {toneText ? (
          <>
            {tone === "success" ? (
              <svg
                className={styles.toneIcon}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg
                className={styles.toneIcon}
                width="18"
                height="18"
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
            <span className={styles.visuallyHidden}>{toneText}</span>
          </>
        ) : null}
        {value}
      </dd>
      {hint ? <dd className={styles.hint}>{hint}</dd> : null}
    </dl>
  );
}
