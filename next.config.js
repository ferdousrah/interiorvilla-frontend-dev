/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['commondatastorage.googleapis.com'],
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/media/',
          outputPath: 'static/media/',
        },
      },
    });
    return config;
  },
}

module.exports = nextConfig