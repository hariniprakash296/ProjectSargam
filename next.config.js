/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better audio handling
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Allow larger file uploads
    },
  },
  // Configure webpack for audio file handling
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3|wav|mid|midi)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

module.exports = nextConfig;

