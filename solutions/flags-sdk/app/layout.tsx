import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { VercelToolbar } from '@vercel/toolbar/next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Flags',
  description: 'Flags SDK example with Next.js and App Directory',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <VercelToolbar />
      </body>
    </html>
  )
}
