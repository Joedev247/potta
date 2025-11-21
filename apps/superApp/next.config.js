/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  cacheComponents: true,
  // Enable static optimization
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Disable telemetry
  telemetry: false,
};

module.exports = nextConfig;