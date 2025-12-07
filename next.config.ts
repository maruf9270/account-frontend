import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath: "/",
  // assetPrefix: "/",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
  experimental: {},
};

export default nextConfig;
