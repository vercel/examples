import type { ReactNode } from 'react'
import '@vercel/examples-ui/globals.css'
import './globals.css'

export const metadata = {
  title: 'Contentful CMS Bulk Redirects (vercel.ts)',
  description: 'Sync Contentful redirect entries into Vercel bulk redirects with vercel.ts.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="text-slate-900 antialiased">
        <div className="min-h-screen bg-white">
          <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
        </div>
      </body>
    </html>
  )
}
