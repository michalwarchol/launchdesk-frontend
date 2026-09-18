"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { setLocale } from "@/app/actions/set-locale";
import Select from "@/components/Select";
import { isLocale, locales } from "@/i18n/config";

import styles from "./LanguageSection.module.scss";

export default function LanguageSection() {
  const t = useTranslations("SettingsPage");
  const activeLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const options = locales.map((locale) => ({
    value: locale,
    label: t(`languages.${locale}`),
  }));

  // `setLocale` revalidates the whole layout, so the change applies without a submit button.
  const handleChange = (value: string) => {
    if (!isLocale(value) || value === activeLocale) return;

    startTransition(() => setLocale(value));
  };

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{t("languageTitle")}</h2>
        <p className={styles.description}>{t("languageDescription")}</p>
      </header>

      <Select
        className={styles.select}
        label={t("languageLabel")}
        options={options}
        value={activeLocale}
        disabled={isPending}
        onChange={handleChange}
      />
    </section>
  );
}
