import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    default: 'AI Visibility Tracker',
    template: '%s · AI Visibility Tracker',
  },
  description:
    'Track how ChatGPT, Perplexity, Gemini, Claude and Grok mention, cite and describe your brand.',
  openGraph: {
    title: 'AI Visibility Tracker',
    description:
      'Track how ChatGPT, Perplexity, Gemini, Claude and Grok mention, cite and describe your brand.',
    images: [{ url: '/thumbnail.png', width: 1440, height: 756 }],
  },
}

/** Every page reads the tracker database at request time. */
export const dynamic = 'force-dynamic'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        'font-sans',
        inter.variable
      )}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
