import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // accept images from all domain 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  typescript:{
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
