import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // ✅ PERFORMANCE: Compress responses to reduce bandwidth
  compress: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // ✅ PERFORMANCE: Limit generated image sizes to what's actually used
    // Prevents Next.js from generating dozens of unused size variants
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // ✅ PERFORMANCE: Use WebP format for smaller file sizes
    formats: ['image/webp'],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // ✅ PERFORMANCE: Set default headers for static assets caching
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
