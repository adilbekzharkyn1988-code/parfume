import type { NextConfig } from "next";

// NOTE for GitHub Pages deployment:
// If this repo is published at https://<user>.github.io/<repo-name>/ (project page,
// not a *.github.io root repo), uncomment the two lines below and set your repo name.
// const REPO = "/your-repo-name";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // basePath: REPO,
  // assetPrefix: REPO,
};

export default nextConfig;
