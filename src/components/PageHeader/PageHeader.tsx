"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import styles from "./PageHeader.module.scss";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  onBack?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  backHref,
  onBack,
  children,
  className,
}: PageHeaderProps) {
  const t = useTranslations("PageHeader");
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (backHref) {
      router.push(backHref);
      return;
    }

    router.back();
  };

  const headerClassName = [styles.header, className].filter(Boolean).join(" ");

  return (
    <header className={headerClassName}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
          aria-label={t("back")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className={styles.titles}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
      </div>
      {children ? <div className={styles.actions}>{children}</div> : null}
    </header>
  );
}
