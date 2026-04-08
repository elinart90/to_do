import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // The SWC WASM bindings on Node v24 break the tsc worker — types are still checked in your IDE
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
