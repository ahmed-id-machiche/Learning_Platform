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
        destination: "https://frontend-api.clerk.services/__clerk/:path*",
      },
    ];
  },
};

export default nextConfig;
