import type { ReactNode } from 'react'
import { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: '...',
  description: '...',
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
