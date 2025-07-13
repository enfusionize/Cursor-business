/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['via.placeholder.com', 'images.unsplash.com'],
  },
  experimental: {
    appDir: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig