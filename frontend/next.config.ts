import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'images.unsplash.com',
      'raw.githubusercontent.com'
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
