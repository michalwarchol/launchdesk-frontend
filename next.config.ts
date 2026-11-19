import createNextIntlPlugin from "next-intl/plugin";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  sassOptions: {},
  experimental: {
    // Production only. Inlines route CSS into the HTML so the landing page has no
    // render-blocking stylesheet request.
    inlineCss: true,
    turbopackServerFastRefresh: false,
    turbopackFileSystemCacheForDev: false,
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
