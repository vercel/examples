import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@/components/Analytics'
import Navbar from '@/components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Forge CLI - Build tools for modern developers',
  description: 'A powerful CLI toolkit for scaffolding, building, and deploying applications',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased bg-white dark:bg-black text-gray-900 dark:text-gray-100">
        <Analytics />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
