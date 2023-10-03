import './globals.css'
import { Inter } from 'next/font/google'

export const metadata = {
  title: 'Vercel Blob Starter',
  description: 'A simple Next.js app with Vercel Blob for image uploads',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
