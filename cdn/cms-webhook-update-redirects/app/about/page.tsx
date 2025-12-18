import Link from 'next/link'

export default function About() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="py-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-8"
          >
            ← Back to store
          </Link>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            How it works
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            This demo uses Vercel&apos;s bulk redirects feature to manage
            seasonal URLs without code changes.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* The Problem */}
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
              The problem
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              E-commerce sites often need vanity URLs that stay consistent while
              the content behind them changes:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-gray-400">•</span>
                <span>
                  <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-900 rounded text-sm font-mono">
                    /catalog/fall
                  </code>{' '}
                  should always show the current fall collection
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400">•</span>
                <span>
                  <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-900 rounded text-sm font-mono">
                    /catalog/latest
                  </code>{' '}
                  should point to the newest drop
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400">•</span>
                <span>
                  Retired product SKUs should redirect to relevant collections
                </span>
              </li>
            </ul>
          </div>

          {/* The Solution */}
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
              The solution
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Vercel&apos;s bulk redirects let you manage thousands of redirects
              at the edge—no middleware, no server-side logic.
            </p>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <div className="font-medium text-black dark:text-white mb-1">
                  1. Manage redirects in any CMS, like Contentful, Sanity, or
                  any API
                </div>
              </div>
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <div className="font-medium text-black dark:text-white mb-1">
                  2. Use webhooks to receive updates when CMS content changes
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The webhook handler uses the Vercel SDK to update the
                  redirects
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <div className="font-medium text-black dark:text-white mb-1">
                  3. Redirects execute at the edge
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fast, globally distributed, no app code involved
                </p>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
              Resources
            </h2>
            <div className="space-y-3">
              <a
                href="https://vercel.com/docs/edge-network/redirects"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-black dark:hover:border-white transition-colors"
              >
                <div>
                  <div className="font-medium text-black dark:text-white">
                    Vercel Redirects Docs
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Official documentation
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </a>
              <a
                href="https://github.com/vercel/examples/tree/main/cdn/cms-webhook-update-redirects"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-black dark:hover:border-white transition-colors"
              >
                <div>
                  <div className="font-medium text-black dark:text-white">
                    Source Code
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    View on GitHub
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
