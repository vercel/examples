export default function BookPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Connect your booking page
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            This template uses{' '}
            <a
              href="https://vercel.com/docs/routing/project-routing-rules"
              className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline underline-offset-2"
            >
              Vercel project routes
            </a>
            {' '}to proxy{' '}
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">/book</code>
            {' '}to your scheduling platform. Once configured, this page is replaced by your Cal.com booking page.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-6 mb-6">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-5 uppercase tracking-wider">
            Set up in 2 minutes
          </h2>
          <ol className="space-y-5">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center mt-0.5">
                1
              </span>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Open your project in the Vercel Dashboard
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Navigate to <strong className="text-gray-700 dark:text-gray-300">CDN</strong> &rarr; <strong className="text-gray-700 dark:text-gray-300">Routing</strong>
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center mt-0.5">
                2
              </span>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Create a rewrite route
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded font-mono">/book/:path*</code>
                  {' '}&rarr;{' '}your Cal.com URL
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center mt-0.5">
                3
              </span>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Test and publish
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Preview with the staging alias, then publish to production
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="flex gap-3">
          <a
            href="https://vercel.com/docs/routing/project-routing-rules"
            className="flex-1 inline-flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
          >
            View Docs
          </a>
          <a
            href="https://github.com/vercel/examples/tree/main/cdn/cal-booking-rewrite#in-code-alternative-approach"
            className="flex-1 inline-flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm"
          >
            Use vercel.ts instead
          </a>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-600 mt-6 text-center leading-relaxed">
          Once the project route is active, the CDN rewrite intercepts requests
          before they reach Next.js, replacing this page automatically.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-5 py-4">
          <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
            <strong className="text-gray-600 dark:text-gray-400">Running locally?</strong>{' '}
            Project routes only work on Vercel&apos;s CDN. In local development,
            you&apos;ll always see this page. Deploy to Vercel and add the route
            to see it in action.
          </p>
        </div>
      </div>
    </main>
  )
}
