'use client'

import posthog from 'posthog-js'

export default function Docs() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-6">
          Documentation
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
          Get started with Forge CLI in minutes.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              Installation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Install Forge CLI globally using your preferred package manager:
            </p>
            <div className="bg-black dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-green-400">$</span>
                <span className="text-white">npm install -g @forge/cli</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              Quick Start
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-black dark:text-white mb-2">1. Create a new project</h3>
                <div className="bg-black dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
                  <span className="text-green-400">$</span>
                  <span className="text-white ml-2">forge init my-app</span>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-black dark:text-white mb-2">2. Navigate to your project</h3>
                <div className="bg-black dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
                  <span className="text-green-400">$</span>
                  <span className="text-white ml-2">cd my-app</span>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-black dark:text-white mb-2">3. Start development server</h3>
                <div className="bg-black dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
                  <span className="text-green-400">$</span>
                  <span className="text-white ml-2">forge dev</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              Commands
            </h2>
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-black dark:text-white">Command</th>
                    <th className="text-left px-4 py-3 font-medium text-black dark:text-white">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr
                    onClick={() => posthog.capture('docs_command_viewed', { command: 'init' })}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">forge init</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Create a new project</td>
                  </tr>
                  <tr
                    onClick={() => posthog.capture('docs_command_viewed', { command: 'dev' })}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">forge dev</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Start development server</td>
                  </tr>
                  <tr
                    onClick={() => posthog.capture('docs_command_viewed', { command: 'build' })}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">forge build</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Build for production</td>
                  </tr>
                  <tr
                    onClick={() => posthog.capture('docs_command_viewed', { command: 'deploy' })}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">forge deploy</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Deploy to production</td>
                  </tr>
                  <tr
                    onClick={() => posthog.capture('docs_command_viewed', { command: 'add' })}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">forge add</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Add a plugin or component</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-800 pt-12">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              This is a demo site showcasing PostHog analytics integration via Vercel's reverse proxy.{' '}
              <a href="/about" className="text-black dark:text-white hover:underline">
                Learn how it works →
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

