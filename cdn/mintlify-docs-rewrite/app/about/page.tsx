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
          About Flux
        </h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Flux is a real-time event platform designed to make it easy to build event-driven applications. Whether you&apos;re sending transactional events, processing webhooks, or building real-time notifications, Flux handles the infrastructure so you can focus on your product.
          </p>

          <div className="space-y-8">
            <section className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-3">
                Built for scale
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                From thousands to millions of events per second, Flux automatically scales to handle your traffic. Events are persisted to durable storage and retried with exponential backoff to guarantee delivery.
              </p>
            </section>

            <section className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-3">
                Developer experience first
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drop-in SDKs for all major languages make integration seamless. Comprehensive API documentation and example code get you up and running in minutes.
              </p>
            </section>

            <section className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-3">
                Complete observability
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Track every event with detailed logs, traces, and delivery analytics. Debug production issues quickly with comprehensive error context and retry history.
              </p>
            </section>

            <section className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-3">
                Secure by default
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                All events are encrypted in transit and at rest. Webhook signatures are automatically verified to prevent spoofing. Fine-grained access controls let you manage API keys and permissions with ease.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

