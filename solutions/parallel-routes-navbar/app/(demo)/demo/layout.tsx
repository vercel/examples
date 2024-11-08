import type { ReactNode } from 'react'

import '@vercel/examples-ui/globals.css'
import Link from 'next/link'

export default function RootLayout({
  children,
  breadcrumb,
}: {
  children: ReactNode
  breadcrumb: ReactNode
}) {
  return (
    <html lang="en">
      <body className="container max-w-screen-sm m-auto grid gap-4 p-4">
        <header>
          <ul className="flex gap-4 font-medium underline">
            <li>
              <Link href="/demo/pastries/key-lime-pie">Key Lime Pie</Link>
            </li>
            <li>
              <Link href="/demo/cakes/pumpkin-pie">Pumpkin Pie</Link>
            </li>
            <li>
              <Link href="/demo/cakes/apple-pie">Apple Pie</Link>
            </li>
          </ul>
          {breadcrumb}
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
