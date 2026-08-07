import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/__clerk/:path*",
        destination: "https://artistic-pika-3.clerk.accounts.dev/__clerk/:path*",
      },
    ];
  },
};

export default nextConfig;
