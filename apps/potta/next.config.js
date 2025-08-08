/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Disable font optimization to prevent Google Fonts issues
  experimental: {
    optimizeFonts: false,
  },
  // Disable telemetry
  telemetry: false,
};

module.exports = nextConfig;
