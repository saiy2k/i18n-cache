/** @type {import('next').NextConfig} */
const nextConfig = {
  generateEtags: false,
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
          {
            key: 'x-middleware-cache',
            value: 'no-cache',
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
