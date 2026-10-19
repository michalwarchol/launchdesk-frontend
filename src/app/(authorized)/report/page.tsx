import { getTranslations } from "next-intl/server";

import { sidebarPageMetadata } from "@/lib/page-metadata";

import styles from "./page.module.scss";
import ReportForm from "./ReportForm";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return sidebarPageMetadata("report");
}

export default async function ReportPage() {
  const t = await getTranslations("ReportPage");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </header>
      <ReportForm />
    </div>
  );
}
