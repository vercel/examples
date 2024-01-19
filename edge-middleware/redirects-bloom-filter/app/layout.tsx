import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Redirect link examples',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <section className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
          <nav className="flex items-center justify-between p-6 bg-gray-200 dark:bg-gray-800">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Lots of Links
            </h1>
            <div className="flex gap-4">
              <Link
                className="text-gray-900 hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
                href="#"
              >
                Mail
              </Link>
              <Link
                className="text-gray-900 hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
                href="#"
              >
                News
              </Link>
              <Link
                className="text-gray-900 hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
                href="#"
              >
                Finance
              </Link>
              <Link
                className="text-gray-900 hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
                href="#"
              >
                Sports
              </Link>
              <Link
                className="text-gray-900 hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
                href="#"
              >
                Entertainment
              </Link>
              <Link
                className="text-gray-900 hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
                href="#"
              >
                Search
              </Link>
              <Link
                className="text-gray-900 hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
                href="#"
              >
                More
              </Link>
            </div>
          </nav>
          <main className="flex-1 p-6 space-y-6">{children}</main>
          <footer className="p-6 bg-gray-200 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-gray-50">
                © 2023 Lots of Links
              </span>
              <div className="flex gap-4">
                <Link
                  className="text-gray-900 hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
                  href="#"
                >
                  Privacy
                </Link>
                <Link
                  className="text-gray-900 hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
                  href="#"
                >
                  Terms
                </Link>
                <Link
                  className="text-gray-900 hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
                  href="#"
                >
                  About Us
                </Link>
              </div>
            </div>
          </footer>
        </section>
      </body>
    </html>
  )
}
