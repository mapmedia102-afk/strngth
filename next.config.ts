import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/strngth',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
