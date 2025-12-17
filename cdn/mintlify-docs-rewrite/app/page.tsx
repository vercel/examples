import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="py-24 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Powered by vercel.ts rewrites
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white mb-6">
            Mintlify Docs Rewrite
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Host your Mintlify documentation at <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-lg font-mono">/docs</code> on 
            your main domain using Vercel rewrites.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              View Documentation →
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              How it works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Use Vercel&apos;s rewrite rules to serve Mintlify docs from your own domain.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">Configure vercel.ts</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Set your Mintlify docs URL in the <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">MINTLIFY_DOCS_URL</code> environment variable.
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">Deploy to Vercel</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vercel reads the rewrite rules from <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">vercel.ts</code> and applies them at the edge.
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">Seamless docs</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Visitors access <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">yourdomain.com/docs</code> and see your Mintlify docs, fully branded.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">
            Example configuration
          </h3>
          <div className="bg-gray-950 rounded-xl p-6 overflow-x-auto">
            <pre className="text-sm text-gray-300 font-mono">
{`import type { VercelConfig } from '@vercel/config/v1'

const MINTLIFY_DOCS_URL = process.env.MINTLIFY_DOCS_URL || 'https://your-docs.mintlify.app'

export const config: VercelConfig = {
  framework: 'nextjs',
  outputDirectory: '.next',
  rewrites: [
    {
      source: '/docs',
      destination: MINTLIFY_DOCS_URL,
    },
    {
      source: '/docs/:path*',
      destination: \`\${MINTLIFY_DOCS_URL}/:path*\`,
    },
  ],
}`}
            </pre>
          </div>
        </div>
      </section>
    </main>
  )
}

