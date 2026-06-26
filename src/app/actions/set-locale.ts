"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { locales, type Locale } from "@/i18n/config";

export async function setLocale(locale: Locale) {
  if (!locales.includes(locale)) return;

  const store = await cookies();
  store.set("locale", locale, { path: "/" });

  revalidatePath("/", "layout");
}
