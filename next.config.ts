import type { NextConfig } from "next";

// This project is now built and hosted on Netlify (not GitHub Pages),
// so we no longer use a static export (`output: "export"`).
// Netlify runs Next.js as a real server, which lets Sanity Studio's
// dynamic routes and document actions (Publish/Delete/Discard) work correctly.

const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

export default nextConfig;
