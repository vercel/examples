'use client'

import Link from 'next/link'
import posthog from 'posthog-js'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white mb-6">
            Build faster with Forge
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            A powerful CLI toolkit for scaffolding, building, and deploying modern applications.
            From zero to production in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => posthog.capture('cta_clicked', { location: 'hero', type: 'primary' })}
              className="inline-flex items-center justify-center bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Get Started
            </button>
            <Link
              href="/docs"
              onClick={() => posthog.capture('cta_clicked', { location: 'hero', type: 'secondary' })}
              className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Install Command */}
      <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-black dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <span className="text-green-400">$</span>
              <span className="text-white">npm install -g @forge/cli</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-green-400">$</span>
              <span className="text-white">forge init my-app</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Everything you need
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              A complete toolkit designed for modern development workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => posthog.capture('feature_explored', { feature: 'scaffolding' })}
              className="group block text-left"
            >
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-8 h-64 flex flex-col justify-between hover:border-black dark:hover:border-white transition-colors">
                <div>
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Scaffolding</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Generate project structures with best practices baked in
                  </p>
                </div>
                <span className="text-sm font-medium text-black dark:text-white group-hover:underline">
                  Learn more →
                </span>
              </div>
            </button>

            <button
              onClick={() => posthog.capture('feature_explored', { feature: 'builds' })}
              className="group block text-left"
            >
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-8 h-64 flex flex-col justify-between hover:border-black dark:hover:border-white transition-colors">
                <div>
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Fast Builds</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Incremental builds with smart caching for rapid iteration
                  </p>
                </div>
                <span className="text-sm font-medium text-black dark:text-white group-hover:underline">
                  Learn more →
                </span>
              </div>
            </button>

            <button
              onClick={() => posthog.capture('feature_explored', { feature: 'deploy' })}
              className="group block text-left"
            >
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-8 h-64 flex flex-col justify-between hover:border-black dark:hover:border-white transition-colors">
                <div>
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">One-Click Deploy</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Deploy to any platform with a single command
                  </p>
                </div>
                <span className="text-sm font-medium text-black dark:text-white group-hover:underline">
                  Learn more →
                </span>
              </div>
            </button>

            <button
              onClick={() => posthog.capture('feature_explored', { feature: 'typescript' })}
              className="group block text-left"
            >
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-8 h-64 flex flex-col justify-between hover:border-black dark:hover:border-white transition-colors">
                <div>
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">TypeScript First</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Full type safety with zero configuration required
                  </p>
                </div>
                <span className="text-sm font-medium text-black dark:text-white group-hover:underline">
                  Learn more →
                </span>
              </div>
            </button>

            <button
              onClick={() => posthog.capture('feature_explored', { feature: 'plugins' })}
              className="group block text-left"
            >
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-8 h-64 flex flex-col justify-between hover:border-black dark:hover:border-white transition-colors">
                <div>
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Plugin System</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Extend functionality with community plugins
                  </p>
                </div>
                <span className="text-sm font-medium text-black dark:text-white group-hover:underline">
                  Learn more →
                </span>
              </div>
            </button>

            <button
              onClick={() => posthog.capture('feature_explored', { feature: 'analytics' })}
              className="group block text-left"
            >
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-8 h-64 flex flex-col justify-between hover:border-black dark:hover:border-white transition-colors">
                <div>
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Built-in Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Track build times, bundle sizes, and performance metrics
                  </p>
                </div>
                <span className="text-sm font-medium text-black dark:text-white group-hover:underline">
                  Learn more →
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
            Stay updated
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get notified about new features, updates, and best practices.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
            <button
              onClick={() => posthog.capture('newsletter_signup')}
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
