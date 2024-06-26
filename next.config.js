/** @type {import('next').NextConfig} */

const { withLogtail } = require('@logtail/next');

const redirects = require('./redirects.json');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: '**.ctfassets.net',
    }],
  },
  async headers() {
    return [{
      source: '/:path*',
      has: [{
        type: 'query',
        key: 'preview',
        value: 'true',
      }],
      headers: [{
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN https://app.contentful.com',
      }, {
        key: 'Content-Security-Policy',
        value: 'frame-ancestors \'self\' https://app.contentful.com',
      }],
    }];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.crru.org.uk' }],
        destination: 'https://crru.org.uk/:path*',
        permanent: true,
      },
      ...redirects.map(({ from, to }) => ({
        source: from,
        destination: to,
        permanent: true,
      })),
    ];
  },
};

module.exports = withLogtail(nextConfig);
