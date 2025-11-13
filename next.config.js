/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  swcMinify: false,
  trailingSlash: false,
  generateBuildId: () => {
    return Math.random().toString(36).substring(7)
  }
}

module.exports = nextConfig