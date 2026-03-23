import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-gray-900 dark:text-white">
            <div className="relative">
              <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="9" r="2" fill="currentColor" />
                <rect x="11.25" y="10.5" width="1.5" height="6" rx="0.75" fill="currentColor" />
                <path d="M9 7.5a3.5 3.5 0 0 1 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M6.5 5.5a7 7 0 0 1 11 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M15 7.5a3.5 3.5 0 0 0-6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M17.5 5.5a7 7 0 0 0-11 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span>Beacon</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/blog"
              className="text-sm px-3 py-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all"
            >
              Blog
            </Link>
            <Link
              href="/pricing"
              className="text-sm px-3 py-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all"
            >
              Pricing
            </Link>
            <a
              href="https://github.com/vercel/examples/tree/main/cdn/api-proxy-rewrite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-3 py-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
