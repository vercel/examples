import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-black dark:text-white mb-4">
          404
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          This page doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/catalog/fall"
            className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            Browse collections
          </Link>
        </div>
      </div>
    </main>
  )
}
