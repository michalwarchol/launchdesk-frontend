import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import {
  ANALYTICS_CONSENT_COOKIE,
  parseAnalyticsConsent,
} from "@/lib/analytics/consent";
import { homePathForRole } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";

import CookieConsent from "./_landing/CookieConsent";
import Faq from "./_landing/Faq";
import Features from "./_landing/Features";
import FinalCta from "./_landing/FinalCta";
import Hero from "./_landing/Hero";
import HowItWorks from "./_landing/HowItWorks";
import JsonLd from "./_landing/JsonLd";
import LandingFooter from "./_landing/LandingFooter";
import LandingHeader from "./_landing/LandingHeader";
import Problems from "./_landing/Problems";
import styles from "./page.module.scss";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("LandingPage.meta");
  const title = t("title");
  const description = t("description");

  return {
    // `absolute` skips the layout's `%s - LaunchDesk` template, the title already carries the brand.
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function Home() {
  const session = await getSession();

  // Signed-in visitors have no reason to see the marketing page. Send them into the app.
  if (session) redirect(homePathForRole(session.user.role));

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
  const store = await cookies();
  const analyticsConsent = parseAnalyticsConsent(
    store.get(ANALYTICS_CONSENT_COOKIE)?.value,
  );

  return (
    <div className={styles.page}>
      <JsonLd />
      <LandingHeader />
      <main className={styles.main}>
        <Hero />
        <Problems />
        <HowItWorks />
        <Features />
        <Faq />
        <FinalCta />
      </main>
      <LandingFooter showCookieSettings={Boolean(measurementId)} />
      {measurementId ? (
        <CookieConsent initialConsent={analyticsConsent} measurementId={measurementId} />
      ) : null}
    </div>
  );
}
