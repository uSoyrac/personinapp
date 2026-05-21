import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1:3050", "localhost:3050", "127.0.0.1", "localhost"]
};

export default nextConfig;
