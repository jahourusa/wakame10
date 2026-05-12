import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      { protocol: "https", hostname: "app.wakame.ma" },
    ],
    // Custom breakpoints — keep defaults plus a 1920 step so product
    // images can serve up to 2x-density on the 900px-wide modal container.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Cache optimized images for 24h.
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
