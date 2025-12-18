import type { Metadata } from 'next'
import { Analytics } from '@/components/Analytics'
import { Header } from '@/components/Header'
import { EventTracker } from '@/components/EventTracker'
import './globals.css'

export const metadata: Metadata = {
  title: 'PostHog Analytics Proxy',
  description: 'Proxy PostHog analytics through Vercel to bypass ad blockers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gradient-to-br from-slate-950 to-slate-900 text-white min-h-screen">
        <Analytics />
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          {children}
          <EventTracker />
        </div>
      </body>
    </html>
  )
}

