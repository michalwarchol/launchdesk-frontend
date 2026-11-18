"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import styles from "./PageHeader.module.scss";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  backHref?: string;
  onBack?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const HEADINGS = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" } as const;

export default function PageHeader({
  title,
  subtitle,
  headingLevel = 1,
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
  const Heading = HEADINGS[headingLevel];

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
          <Heading className={styles.title}>{title}</Heading>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
      </div>
      {children ? <div className={styles.actions}>{children}</div> : null}
    </header>
  );
}
