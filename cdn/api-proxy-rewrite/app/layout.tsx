import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import Navbar from '../components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Beacon - Product analytics that just works',
  description: 'Understand user behavior, track key metrics, and ship better products with Beacon.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased bg-white dark:bg-black text-gray-900 dark:text-gray-100">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
