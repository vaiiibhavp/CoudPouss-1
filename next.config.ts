import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */


    images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '163.227.92.122',
        port: '4001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '163.227.92.122',
        port: '4009',
        pathname: '/**',
      },
    ],
  },
 
};

export default nextConfig;
