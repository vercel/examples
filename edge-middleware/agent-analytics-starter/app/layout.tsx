import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agent Analytics Starter',
  description:
    'Next.js starter that tracks AI agent traffic (ClaudeBot, GPTBot, Perplexity, and more) in PostHog via @apideck/agent-analytics.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
