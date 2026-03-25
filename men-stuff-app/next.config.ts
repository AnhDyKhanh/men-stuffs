import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // xử lý khỏi bị lỗi mock, có thể review xoas sau
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
