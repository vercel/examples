import { VercelToolbar } from '@vercel/toolbar/next'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { ExamplesBanner } from '@/components/banners/examples-banner'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GrowthBook - Flags SDK Example',
  description: 'A Flags SDK ecommerce example using GrowthBook',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${inter.className}`}
        suppressHydrationWarning
      >
        <ExamplesBanner />
        {children}
        <Toaster />
        <VercelToolbar />
      </body>
    </html>
  )
}
