const nextConfig = {
  eslint: {
    // This will allow the build to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This will allow the build to complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
