import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/app", destination: "/", permanent: true },
      { source: "/app/:path*", destination: "/:path*", permanent: true },
    ];
  },
  reactCompiler: true,
  // Android 에뮬레이터 WebView(10.0.2.2) 등에서 dev HMR 허용
  allowedDevOrigins: ["10.0.2.2", "192.168.25.57"],
  transpilePackages: ["@storyecho/api-client", "@storyecho/schemas", "@storyecho/database"],
};

export default nextConfig;
