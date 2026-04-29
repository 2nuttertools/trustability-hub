import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "essentia.dl.co.th" },
      { protocol: "https", hostname: "**.dl.co.th" },
    ],
  },
};

export default nextConfig;
