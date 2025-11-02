import { VercelToolbar } from '@vercel/toolbar/next'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { FlagBootstrapData } from 'flags/react'

import './globals.css'
import { ExamplesBanner } from '@/components/banners/examples-banner'

export const metadata: Metadata = {
  title: 'Statsig - Flags SDK Example',
  description: 'A Flags SDK ecommerce example using Statsig',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ExamplesBanner />
        {children}
        <Toaster />
        <VercelToolbar />
        <FlagBootstrapData />
      </body>
    </html>
  )
}
