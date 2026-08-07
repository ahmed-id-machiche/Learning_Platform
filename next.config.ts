import type { NextConfig } from "next";

function getClerkFrontendApiDomain(): string {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return "clerk.accounts.dev";
  try {
    const base64Part = key.replace(/^pk_(test|live)_/, "");
    const decoded = Buffer.from(base64Part, "base64").toString("utf-8");
    return decoded.replace(/\$$/, "").trim();
  } catch {
    return "clerk.accounts.dev";
  }
}

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
    const clerkDomain = getClerkFrontendApiDomain();
    return [
      {
        source: "/__clerk/:path*",
        destination: `https://${clerkDomain}/__clerk/:path*`,
      },
    ];
  },
};

export default nextConfig;
