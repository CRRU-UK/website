import type { NextConfig } from "next";

import redirects from "./redirects.json";

const CSPHeader = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-eval' 'unsafe-inline' challenges.cloudflare.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' blob: data: *.ctfassets.net *.paypalobjects.com`,
  `media-src 'self' blob: *.ctfassets.net`,
  `font-src 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self' *.paypal.com`,
  `frame-src 'self' challenges.cloudflare.com *.youtube.com *.youtube-nocookie.com *.google.com`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const staticPublicAssets = [
  "/fonts/(.*)",
  "/apple-touch-icon.png",
  "/android-chrome-(.*).png",
  "/bimi-logo.svg",
  "/favicon-(.*).png",
  "/favicon.ico",
  "/robots.txt",
  "/site.webmanifest",
  "/web-app-(.*).png",
];

const commonCacheDirectives = [
  "public",
  "max-age=0",
  "s-maxage=31536000", // 1 year
  "stale-while-revalidate=1209600", // 2 weeks
  "stale-if-error=604800", // 1 week
].join(", ");

const productionHeaders = [
  ...staticPublicAssets.map((source) => ({
    source,
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable", // 1 year
      },
      {
        key: "Cache-Key",
        value: "static",
      },
    ],
  })),
  {
    source: "/_next/data/(.*)",
    headers: [
      {
        key: "Cache-Control",
        value: commonCacheDirectives,
      },
      {
        key: "Cache-Key",
        value: "data",
      },
    ],
  },
  {
    source: "/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: commonCacheDirectives,
      },
      {
        key: "Cache-Key",
        value: "page",
      },
    ],
  },
];

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    scrollRestoration: true,
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ctfassets.net",
      },
    ],
  },
  async headers() {
    let headers = [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: CSPHeader,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "query",
            key: "preview",
            value: "true",
          },
        ],
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN https://app.contentful.com",
          },
          {
            key: "Content-Security-Policy",
            value: CSPHeader.replace(
              `frame-ancestors 'none'`,
              `frame-ancestors 'self' https://app.contentful.com`,
            ),
          },
        ],
      },
    ];

    if (isProduction) {
      headers = [...headers, ...productionHeaders];
    }

    return headers;
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.crru.org.uk" }],
        destination: "https://crru.org.uk/:path*",
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
