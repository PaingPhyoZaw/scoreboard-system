/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  serverExternalPackages: ['@prisma/client', '@supabase/auth-helpers-nextjs'],
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
      layers: true
    }
    return config
  }
}

export default nextConfig
