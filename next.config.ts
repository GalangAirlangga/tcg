import type { NextConfig } from "next";

const nextConfig: NextConfig = {
//  srcDir: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pokemontcg.io',
      }
    ]
  }
};

export default nextConfig;
