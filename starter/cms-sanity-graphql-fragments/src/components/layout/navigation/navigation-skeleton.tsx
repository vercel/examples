export function NavigationSkeleton() {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-8 sm:px-20">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* Logo skeleton */}
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

            {/* Nav links skeleton */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>

          {/* Mobile menu button skeleton */}
          <div className="md:hidden">
            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </nav>
  );
}
