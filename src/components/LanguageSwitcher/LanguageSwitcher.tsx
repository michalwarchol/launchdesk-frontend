"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { setLocale } from "@/app/actions/set-locale";
import { locales, type Locale } from "@/i18n/config";

// TODO: temporary demo switcher. Replace with the future settings page UI.
export default function LanguageSwitcher() {
  const t = useTranslations("HomePage");
  const activeLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <span>{t("switchLanguage")}: </span>
      {locales.map((locale: Locale) => (
        <button
          key={locale}
          type="button"
          disabled={isPending || locale === activeLocale}
          onClick={() => startTransition(() => setLocale(locale))}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
