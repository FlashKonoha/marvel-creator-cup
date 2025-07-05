/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations for high-scale usage
  experimental: {
    // Enable server components for better performance
    serverComponentsExternalPackages: [],
  },
  
  // Image optimization
  images: {
    domains: ['picsum.photos'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compression and caching
  compress: true,
  
  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/api/draft',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=5, s-maxage=5',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    
    return config
  },
}

module.exports = nextConfig; 