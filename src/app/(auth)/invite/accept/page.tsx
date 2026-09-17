import Link from "next/link";
import { getTranslations } from "next-intl/server";

import Alert from "@/components/Alert";
import { lookupInvite } from "@/lib/auth/invite";

import styles from "./AcceptInvite.module.scss";
import AcceptInviteForm from "./AcceptInviteForm";

interface AcceptInvitePageProps {
  searchParams: Promise<{ next?: string; token?: string }>;
}

export default async function AcceptInvitePage({ searchParams }: AcceptInvitePageProps) {
  const { next, token } = await searchParams;
  const t = await getTranslations("AcceptInvitePage");
  const invite = lookupInvite(token);

  if (invite.status !== "valid") {
    return (
      <div className={styles.invite}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t("title")}</h1>
        </header>

        <Alert>{t(`errors.${invite.status === "used" ? "tokenUsed" : "invalidToken"}`)}</Alert>

        <Link className={styles.backLink} href="/login">
          {t("backToLogin")}
        </Link>
      </div>
    );
  }

  return <AcceptInviteForm token={invite.token} email={invite.email} next={next} />;
}
