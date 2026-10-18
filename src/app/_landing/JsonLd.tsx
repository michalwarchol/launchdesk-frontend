import { getLocale, getTranslations } from "next-intl/server";

import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

import { FAQ_KEYS } from "./faqItems";

export default async function JsonLd() {
  const t = await getTranslations("LandingPage");
  const locale = await getLocale();

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/android-chrome-512x512.png`,
        email: CONTACT_EMAIL,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: t("meta.description"),
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: ["en", "pl"],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_KEYS.map((key) => ({
          "@type": "Question",
          name: t(`faq.items.${key}.question`),
          acceptedAnswer: {
            "@type": "Answer",
            text: t(`faq.items.${key}.answer`),
          },
        })),
      },
    ],
  };

  // `<` is escaped so that translated copy can never break out of the script tag.
  const json = JSON.stringify(graph).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
