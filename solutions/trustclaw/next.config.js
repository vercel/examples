/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,

  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Content-Security-Policy",
                  value: [
                    "default-src 'self'",
                    // 'unsafe-inline' is here because Next.js streams inline
                    // hydration scripts. A nonce-based CSP is the proper fix
                    // but our prior attempt broke hydration; revisit later.
                    "script-src 'self' 'unsafe-inline'",
                    "style-src 'self' 'unsafe-inline'",
                    "img-src 'self' data: https:",
                    "font-src 'self' data:",
                    "connect-src 'self' *.composio.dev",
                    "frame-ancestors 'none'",
                    "object-src 'none'",
                    "base-uri 'self'",
                    "form-action 'self'",
                    "upgrade-insecure-requests",
                  ].join("; "),
                },
              ]
            : []),
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logos.composio.dev",
      },
    ],
  },

  // Transpile packages if needed
  transpilePackages: [],

  // Strict mode for better debugging
  typescript: {
    ignoreBuildErrors: false,
  },

  // Skip ESLint during `next build`. Lint is run separately as a CI step
  // (see vercel/examples root husky pre-commit). Running it during build
  // creates a config conflict in this template's monorepo position because
  // the local flat-config eslint loads typescript-eslint rules that the
  // root .eslintrc.json doesn't recognize, so disable comments in source
  // are accepted by one config and rejected by the other.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
