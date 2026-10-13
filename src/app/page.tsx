import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { homePathForRole } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";

import styles from "./page.module.scss";

export default async function Home() {
  const session = await getSession();

  // Logged-in visits have no shell here. Send them into the app instead of the placeholder.
  if (session) redirect(homePathForRole(session.user.role));

  const t = await getTranslations("HomePage");

  return (
    <div className={styles.page}>
      <main>
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </main>
    </div>
  );
}
