import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { findAccountByUserId } from "@/lib/auth/mockData";
import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";

import LanguageSection from "./LanguageSection";
import styles from "./page.module.scss";
import PasswordForm from "./PasswordForm";
import ProfileForm from "./ProfileForm";

export default async function SettingsPage() {
  const t = await getTranslations("SettingsPage");
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  const { user } = session;
  const account = findAccountByUserId(session.userId);

  return (
    <div className={styles.settings}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </header>

      <div className={styles.sections}>
        <ProfileForm user={user} />
        <PasswordForm hasPassword={account?.password !== null} />
        <LanguageSection />
      </div>
    </div>
  );
}
