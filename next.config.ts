import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow server-side packages like pdf-parse
  serverExternalPackages: ['pdf-parse'],

  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
