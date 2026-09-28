import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ChatProvider } from '@/lib/chat-context'
import { CommandLogsStream } from '@/components/commands-logs/commands-logs-stream'
import { ErrorMonitor } from '@/components/error-monitor/error-monitor'
import { SandboxState } from '@/components/modals/sandbox-state'
import { Toaster } from '@/components/ui/sonner'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'

const title = 'OSS Vibe Coding Platform'
const description =
  'Build applications with an eve coding agent, persistent Vercel Sandbox workspaces, AI Gateway, and Next.js.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: 'https://assets.vercel.com/image/upload/v1754588799/OSSvibecodingplatform/OG.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://assets.vercel.com/image/upload/v1754588799/OSSvibecodingplatform/OG.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Suspense fallback={null}>
          <NuqsAdapter>
            <ChatProvider>
              <ErrorMonitor>{children}</ErrorMonitor>
            </ChatProvider>
          </NuqsAdapter>
        </Suspense>
        <Toaster />
        <CommandLogsStream />
        <SandboxState />
      </body>
    </html>
  )
}
