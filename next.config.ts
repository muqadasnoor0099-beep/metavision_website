import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // false: emits about.html (better for static hosts). true: about/index.html (needs /about/ URL).
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
