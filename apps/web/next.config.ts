import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@invitely/shared', '@invitely/ui', '@invitely/types', '@invitely/config', '@invitely/validators'],
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@invitely/ui'],
  },
};

export default nextConfig;
