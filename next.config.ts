import type { NextConfig } from "next";

const REPO = "/parfume";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: REPO,
  assetPrefix: REPO,
};

export default nextConfig;
