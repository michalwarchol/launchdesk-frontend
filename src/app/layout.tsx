import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import { SITE_NAME, SITE_URL } from "@/lib/site";

import type { Metadata, Viewport } from "next";

import "./globals.css";

// Only used for code blocks inside the rich text editor, so it must not compete with the landing
// page for bandwidth. `next/font` still self-hosts it, it just stops emitting the preload hint.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

// The file name has no comma on purpose: Next emits the preload hint URL-encoded and the
// @font-face URL raw, so a comma makes the browser download the same font twice.
const brand = localFont({
  src: "../fonts/Pliant-Variable.ttf",
  variable: "--font-brand",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Employee onboarding without chaos.",
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#121419",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${geistMono.variable} ${brand.variable}`}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
