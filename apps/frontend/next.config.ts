import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const backendApiUrl = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;
    const backendHost = backendApiUrl.replace(/\/api\/v1\/?$/, '');

    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendApiUrl}/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendHost}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
