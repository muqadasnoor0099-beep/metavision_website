import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed `output: 'export'` — site is deployed on Vercel which runs
  // Next.js natively. Static export was causing back-navigation crashes
  // because Vercel's CDN can't set bfcache headers or recover from stale
  // JS chunks on back/forward navigation. Vercel handles all of this
  // automatically when Next.js runs as a proper server.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
