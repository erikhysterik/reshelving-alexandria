/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Enable static optimization for better performance
  output: 'standalone',
  // Configure for long build times
  staticPageGenerationTimeout: 1000 * 60 * 10, // 10 minutes
}

module.exports = nextConfig