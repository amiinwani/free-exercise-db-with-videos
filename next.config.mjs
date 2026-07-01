/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // R2-hosted thumbnails
    remotePatterns: [
      { protocol: 'https', hostname: 'pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev' },
    ],
  },
};

export default nextConfig;
