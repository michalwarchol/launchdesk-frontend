import createNextIntlPlugin from "next-intl/plugin";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  sassOptions: {}
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
