import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent browsers from sniffing MIME types
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Stop referrer leaking to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features that aren't needed
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Basic XSS protection for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],

  // Strip server-identifying headers
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Ensure API routes never get cached and never expose internals
        source: "/api/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
