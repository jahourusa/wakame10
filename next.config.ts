import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      { protocol: "https", hostname: "app.wakame.ma" },
    ],
  },
};

export default nextConfig;
