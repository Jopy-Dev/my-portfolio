import type { NextConfig } from "next";
import { readSiteEnvironment } from "./src/lib/env";

const environment = readSiteEnvironment();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  ...(environment.SITE_BASE_PATH ? { basePath: environment.SITE_BASE_PATH } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
