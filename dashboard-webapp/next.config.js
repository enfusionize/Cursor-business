/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'vercel.app'],
  },
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    XERO_CLIENT_ID: process.env.XERO_CLIENT_ID,
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
    CLICKUP_API_TOKEN: process.env.CLICKUP_API_TOKEN,
  },
}

module.exports = nextConfig