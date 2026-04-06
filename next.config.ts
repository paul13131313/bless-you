import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/bless-you",
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: "/bless-you",
  },
};

export default nextConfig;
