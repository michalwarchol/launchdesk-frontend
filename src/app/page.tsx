import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { homePathForRole } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";

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
    // `absolute` skips the layout's `%s | LaunchDesk` template, the title already carries the brand.
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
      <LandingFooter />
    </div>
  );
}
