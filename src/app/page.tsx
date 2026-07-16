import { getTranslations } from "next-intl/server";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Sidebar from "@/components/Sidebar";

import styles from "./page.module.scss";

export default async function Home() {
  const t = await getTranslations("HomePage");

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Sidebar />
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
        <LanguageSwitcher />
      </main>
    </div>
  );
}
