import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/become-a-tutor',
        destination: '/teach',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
