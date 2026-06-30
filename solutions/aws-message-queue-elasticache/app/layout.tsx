'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import '@vercel/examples-ui/globals.css'
import './globals.css'

const REPO_URL = 'https://github.com/vercel/examples/tree/main/solutions/aws-message-queue-elasticache'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto h-screen flex flex-col">
          {/* Nav */}
          <nav className="border-b border-gray-200 py-5 relative z-20 bg-white shadow-[0_0_15px_0_rgb(0,0,0,0.1)]">
            <div className="flex items-center lg:px-6 px-8 mx-auto max-w-7xl">
              <div className="flex flex-row items-center">
                <Link href="/">
                  <svg height="26" viewBox="0 0 75 65" fill="#000">
                    <title>Vercel Logo</title>
                    <path d="M37.59.25l36.95 64H.64l36.95-64z" />
                  </svg>
                </Link>
                <span className="ml-2 text-gray-200">
                  <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" shapeRendering="geometricPrecision">
                    <path d="M16.88 3.549L7.12 20.451" />
                  </svg>
                </span>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-gray-500 hover:text-gray-900"
                  style={{ letterSpacing: '.01px' }}
                >
                  AWS Message Queue + ElastiCache
                </a>
              </div>
              <div className="flex-1 justify-end hidden md:flex">
                <nav className="flex-row inline-flex items-center gap-2">
                  <a
                    href="https://github.com/vercel/examples/tree/main"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-900 px-3 py-2"
                  >
                    More Examples →
                  </a>
                </nav>
              </div>
            </div>
          </nav>

          {/* Content */}
          <div className="px-8 bg-white flex-1">
            {children}
          </div>

          {/* Footer */}
          <footer className="py-10 w-full mt-auto border-t flex items-center justify-center bg-gray-50 z-20">
            <span className="text-gray-600">Built with</span>
            <a
              href="https://vercel.com"
              aria-label="Vercel.com Link"
              target="_blank"
              rel="noreferrer"
              className="text-black ml-3"
            >
              <svg className="inline-block h-5" viewBox="0 0 75 65" fill="currentColor">
                <title>Vercel.com Logo</title>
                <path d="M37.59.25l36.95 64H.64l36.95-64z" />
              </svg>
            </a>
          </footer>
        </div>
      </body>
    </html>
  )
}
