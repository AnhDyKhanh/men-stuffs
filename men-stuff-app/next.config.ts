import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // xử lý khỏi bị lỗi mock, có thể review xoas sau
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
}

export default nextConfig
