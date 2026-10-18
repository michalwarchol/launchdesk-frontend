import { SITE_URL } from "@/lib/site";

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: [
          "/api/",
          "/dashboard",
          "/assignments",
          "/documents",
          "/my-tasks",
          "/report",
          "/settings",
          "/tasks",
          "/users",
          "/invite",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
