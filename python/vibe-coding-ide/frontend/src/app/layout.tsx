import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Code Agent',
  description: 'Next.js wrapper for existing UI during migration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
