export default function About() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-6">
          How it works
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
          This site demonstrates how to proxy analytics through Vercel using <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">vercel.ts</code> for first-party data collection.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              First-party analytics proxy
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              By proxying PostHog requests through your own domain, analytics data is collected as first-party traffic. This improves data accuracy and ensures consistent tracking across all users.
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="font-mono text-sm">
                <div className="text-gray-500 dark:text-gray-500 mb-2">// vercel.ts</div>
                <pre className="text-black dark:text-white overflow-x-auto">{`import { routes } from '@vercel/config/v1'

export const config = {
  routes: [
    routes.rewrite('/ph/static/(.*)', 
      'https://us-assets.i.posthog.com/static/$1',
      { requestHeaders: { 'host': 'us-assets.i.posthog.com' } }
    ),
    routes.rewrite('/ph/(.*)', 
      'https://us.i.posthog.com/$1',
      { requestHeaders: { 'host': 'us.i.posthog.com' } }
    ),
  ],
}`}</pre>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              How the proxy works
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-black dark:text-white">Route configuration</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    The <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">vercel.ts</code> file defines rewrite rules that map <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">/ph/*</code> paths to PostHog's servers.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-black dark:text-white">Header rewriting</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    The <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">host</code> header is rewritten so PostHog's servers correctly route the proxied requests.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-black dark:text-white">Client initialization</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    PostHog is initialized with <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">api_host: '/ph'</code> to send all requests through your proxy endpoint.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              Benefits
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="text-black dark:text-white">Better data accuracy</strong> — First-party requests aren't subject to the same restrictions as third-party tracking
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="text-black dark:text-white">No edge function costs</strong> — Uses Vercel's built-in reverse proxy layer
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="text-black dark:text-white">Framework agnostic</strong> — Works with Next.js, Vue, Astro, or any framework
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="text-black dark:text-white">Simple setup</strong> — Just configure routes and set your API key
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              Try it yourself
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Open your browser's Network tab and look for requests to <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">/ph/</code>. You'll see analytics calls going through your domain instead of directly to PostHog.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/vercel/examples/tree/main/cdn/posthog-analytics-proxy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm"
              >
                View on GitHub
              </a>
              <a
                href="https://posthog.com/docs/advanced/proxy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm"
              >
                PostHog Docs
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

