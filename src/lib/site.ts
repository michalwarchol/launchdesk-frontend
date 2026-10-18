/** Absolute origin used for canonical URLs, Open Graph tags, robots and the sitemap. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "LaunchDesk";

export const CONTACT_EMAIL = "hireme@michalwarchol.com";
