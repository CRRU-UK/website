import type { NextConfig } from 'next';

import redirects from './redirects.json';

const cspHeader = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-eval' 'unsafe-inline'`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' blob: data:'`,
  `font-src 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests'`,
].join('; ');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    scrollRestoration: true
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: '**.ctfassets.net',
    }],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [{
        key: 'Content-Security-Policy',
        value: cspHeader,
      }, {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      }],
    }, {
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
        value: [cspHeader, `frame-ancestors 'self' https://app.contentful.com`].join('; '),
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

module.exports = nextConfig;
