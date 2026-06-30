'use client'

import type { ReactNode } from 'react'
import { Layout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          /* Hide the default "Created by" footer from @vercel/examples-ui */
          footer.py-10.border-t span.text-primary {
            visibility: hidden;
            position: relative;
          }
          footer.py-10.border-t span.text-primary::after {
            content: "Built with";
            visibility: visible;
            position: absolute;
            left: 0;
          }
        `}</style>
      </head>
      <body>
        <Layout path="solutions/aws-message-queue-elasticache">{children}</Layout>
      </body>
    </html>
  )
}
