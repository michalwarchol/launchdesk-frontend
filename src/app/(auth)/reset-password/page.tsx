import Link from "next/link";
import { getTranslations } from "next-intl/server";

import Alert from "@/components/Alert";
import { metadataPageMetadata } from "@/lib/page-metadata";

import ResetPasswordForm from "./ResetPasswordForm";
import styles from "./ResetPasswordForm.module.scss";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return metadataPageMetadata("resetPassword");
}

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;
  const t = await getTranslations("ResetPasswordPage");

  if (!token) {
    return (
      <div className={styles.resetPassword}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t("title")}</h1>
        </header>

        <Alert>{t("errors.invalidToken")}</Alert>

        <Link className={styles.backLink} href="/login">
          {t("backToLogin")}
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}
