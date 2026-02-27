import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40 dark:opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 text-sm text-indigo-600 dark:text-indigo-400 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            Now tracking 2B+ events monthly
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
            Product analytics
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              that just works
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Understand user behavior, track key metrics, and ship better
            products. Built for teams that move fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
            >
              Book a Demo
            </Link>
            <a
              href="https://github.com/vercel/examples/tree/main/cdn/cal-booking-rewrite"
              className="inline-flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm"
            >
              View Source
            </a>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400 mb-3 tracking-wide uppercase">
              Platform
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Everything you need to understand your users
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Large card - Real-time Events */}
            <div className="md:col-span-4 group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Real-time Events</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md">
                  Track every user interaction as it happens. Sub-second ingestion
                  with zero sampling across every plan.
                </p>
                {/* Mini visualization */}
                <div className="mt-6 flex items-end gap-1 h-16">
                  {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 50, 88, 72, 92, 68, 78, 82, 58, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-indigo-100 dark:bg-indigo-500/20"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Small card - Funnel Analysis */}
            <div className="md:col-span-2 group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3C17.5 3 22 6 22 6V18C22 18 17.5 21 12 21C6.5 21 2 18 2 18V6C2 6 6.5 3 12 3Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Funnel Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                See where users drop off. Optimize conversion paths with step-by-step breakdowns.
              </p>
            </div>

            {/* Small card - Custom Dashboards */}
            <div className="md:col-span-2 group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Custom Dashboards</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Build dashboards tailored to your team with drag-and-drop widgets and live data.
              </p>
            </div>

            {/* Large card - Team Collaboration */}
            <div className="md:col-span-4 group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-br-full" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Team Collaboration</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md">
                  Share insights across teams with role-based access, annotations,
                  and configurable alerts. Everyone stays in the loop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400 mb-3 tracking-wide uppercase">
              Developer Experience
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Start tracking in minutes
            </h3>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-950 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-700" />
                <div className="w-3 h-3 rounded-full bg-gray-700" />
                <div className="w-3 h-3 rounded-full bg-gray-700" />
              </div>
              <span className="text-xs text-gray-500 font-mono ml-2">app.ts</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono leading-relaxed">
{`import Beacon from '@beacon/sdk';

const beacon = new Beacon('pk_live_...');

// Track a page view
beacon.track('page_view', {
  path: '/pricing',
  referrer: document.referrer
});

// Track a conversion event
beacon.track('subscription_started', {
  plan: 'pro',
  interval: 'monthly',
  value: 29
});`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            See Beacon in action
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Book a 30-minute demo with our team and see how Beacon
            can help you make data-driven decisions.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Book a Demo
          </Link>
        </div>
      </section>
    </main>
  )
}
