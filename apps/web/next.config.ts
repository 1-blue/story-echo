import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: [
    "@storyecho/api-client",
    "@storyecho/schemas",
    "@storyecho/database",
  ],
};

export default nextConfig;
