import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath: "/ddcg/account",
  // assetPrefix: "/ddcg/account",
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
