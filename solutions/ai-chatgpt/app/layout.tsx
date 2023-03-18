import '@vercel/examples-ui/globals.css'

import { Analytics } from '@vercel/analytics/react'
import { AppLayout } from '@vercel/examples-ui'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppLayout
          title="ai-chatgpt"
          path="solutions/ai-chatgpt"
          description="ai-chatgpt"
        >
          {children}
          <Analytics />
        </AppLayout>
      </body>
    </html>
  )
}
