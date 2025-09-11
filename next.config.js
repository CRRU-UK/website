// @ts-check

/**
 * Note: We are using the JavaScript version of the config instead of the TypeScript one as NextJS
 * does not seem to detect that TypeScript is installed when being run and attempts to install it -
 * causing a long delay in the startup time which causes health checks to fail.
 */

import { withSentryConfig } from "@sentry/nextjs";

import redirects from "./redirects.json" assert { type: "json" };

const CSPHeader = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-eval' 'unsafe-inline' challenges.cloudflare.com *.cloudflareinsights.com`,
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
  "/fonts/(.*).ttf",
  "/apple-touch-icon.png",
  "/android-chrome-(.*).png",
  "/bimi-logo.svg",
  "/favicon-(.*).png",
  "/favicon.ico",
  "/robots.txt",
  "/site.webmanifest",
  "/web-app-(.*).png",
];

const productionHeaders = [
  ...staticPublicAssets.map((source) => ({
    source,
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable", // 1 year
      },
    ],
  })),
];

const isProduction = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    const defaultHeaders = [
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
        source: "/:path*",
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
      return [...productionHeaders, ...defaultHeaders];
    }

    return defaultHeaders;
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

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  disableLogger: true,
});
