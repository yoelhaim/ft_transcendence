/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false,
  experimental: {
    // serverActions: true,
    appDir: true,
    // font: 'preload',
    // optimizeCss: true,
  },
  images: {
    domains: ['localhost', 'cdn.intra.42.fr', 'i.ibb.co'],
  },
  env: {
    BASE_URL: 'http://localhost:8000',
    SOCKET_URL: 'ws://localhost:8000',
  },
};


module.exports = nextConfig;
