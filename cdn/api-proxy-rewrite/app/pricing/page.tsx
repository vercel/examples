import Link from 'next/link'

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function PricingPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400 mb-3 tracking-wide uppercase">
            Pricing
          </p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Start free, scale as you grow
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Transparent pricing with no hidden fees. Pay only for what you use.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Free */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 flex flex-col">
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">$0</span>
                <span className="text-gray-500 dark:text-gray-400">/mo</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">For side projects and experiments</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />10K events/month
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />1 dashboard
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />7-day data retention
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />Community support
              </li>
            </ul>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm"
            >
              Get started
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border-2 border-indigo-500 bg-white dark:bg-gray-950 p-8 flex flex-col relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Most popular
              </span>
            </div>
            <div className="mb-8">
              <h3 className="text-sm font-medium text-indigo-500 uppercase tracking-wide mb-4">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">$29</span>
                <span className="text-gray-500 dark:text-gray-400">/mo</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">For growing teams</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />1M events/month
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />Unlimited dashboards
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />90-day data retention
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />Funnel analysis
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />Email support
              </li>
            </ul>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-600 transition-colors text-sm"
            >
              Get started
            </Link>
          </div>

          {/* Enterprise */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 flex flex-col">
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Enterprise</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">Custom</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">For large-scale deployments</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />Unlimited events
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />Unlimited retention
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />SSO &amp; SCIM
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />Dedicated support
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckIcon />Custom SLA
              </li>
            </ul>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
