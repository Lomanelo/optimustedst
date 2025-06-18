/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Remove trailingSlash for better API route compatibility
  trailingSlash: false,
  // Ignore TypeScript errors in production
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors in production
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optimize images
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Handle Firebase and other external resources
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  // Optimize CSS and JS files
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Compress assets
  compress: true,
  // Experimental features for App Router
  experimental: {
    serverComponentsExternalPackages: ['@firebase/app', '@firebase/firestore'],
  },
  // Cache optimization
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig 