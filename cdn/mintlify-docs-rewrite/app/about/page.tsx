import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8"
        >
          ← Back to home
        </Link>

        <h1 className="text-4xl font-bold text-black dark:text-white mb-6">
          How this works
        </h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            This demo shows how to use Vercel&apos;s <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">vercel.ts</code> configuration 
            file to rewrite <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">/docs</code> paths to a Mintlify-hosted documentation site.
          </p>

          <div className="space-y-8">
            <section className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-3">
                Why use rewrites?
              </h2>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">✓</span>
                  Keep your docs on your main domain for better SEO
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">✓</span>
                  No CORS issues - content is served from your domain
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">✓</span>
                  Users see a seamless experience with consistent branding
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">✓</span>
                  Mintlify handles the docs infrastructure
                </li>
              </ul>
            </section>

            <section className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-3">
                The vercel.ts approach
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">vercel.ts</code> file 
                is evaluated at build time. You can use environment variables, fetch from APIs, or run any Node.js code to generate your configuration.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Rewrites defined in <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">vercel.ts</code> are 
                applied at the edge, making them fast and efficient.
              </p>
            </section>

            <section className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-3">
                Configuration
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Set the <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">MINTLIFY_DOCS_URL</code> environment 
                variable to your Mintlify docs URL (e.g., <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">https://your-docs.mintlify.app</code>).
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                The rewrite rules will proxy all requests to <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">/docs/*</code> to 
                your Mintlify site while keeping the URL in the browser unchanged.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

