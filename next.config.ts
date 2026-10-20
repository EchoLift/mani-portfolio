import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "image.mux.com" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
