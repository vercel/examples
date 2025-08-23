import { type Metadata } from 'next'
import { type ReactNode } from 'react'
import { ChatProvider } from '@/lib/chat-context'
import { CommandLogsStream } from '@/components/commands-logs/commands-logs-stream'
import { ErrorMonitor } from '@/components/error-monitor/error-monitor'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { SandboxState } from '@/components/modals/sandbox-state'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const title = 'OSS Vibe Coding Platform'
const description = `This is a demo of an end-to-end coding platform where the user can enter text prompts, and the agent will create a full stack application. It uses Vercel's AI Cloud services like Sandbox for secure code execution, AI Gateway for GPT-5 and other models support, Fluid Compute for efficient rendering and streaming, and it's built with Next.js and the AI SDK.`

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
        <NuqsAdapter>
          <ChatProvider>
            <ErrorMonitor>{children}</ErrorMonitor>
          </ChatProvider>
        </NuqsAdapter>
        <Toaster />
        <SandboxState />
        <CommandLogsStream />
      </body>
    </html>
  )
}
