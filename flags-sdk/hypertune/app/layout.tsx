import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import { VercelToolbar } from '@vercel/toolbar/next'
import { ExamplesBanner } from '@/components/banners/examples-banner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flags SDK Example',
  description: 'A Flags SDK ecommerce example',
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
      </body>
    </html>
  )
}
