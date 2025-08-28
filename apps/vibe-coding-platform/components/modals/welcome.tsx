'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { InfoIcon } from 'lucide-react'
import { create } from 'zustand'
import { useEffect } from 'react'

interface State {
  open: boolean | undefined
  setOpen: (open: boolean) => void
}

export const useWelcomeStore = create<State>((set) => ({
  open: undefined,
  setOpen: (open) => set({ open }),
}))

export function Welcome(props: {
  onDismissAction(): void
  defaultOpen: boolean
}) {
  const { open, setOpen } = useWelcomeStore()

  useEffect(() => {
    setOpen(props.defaultOpen)
  }, [setOpen, props.defaultOpen])

  if (!(typeof open === 'undefined' ? props.defaultOpen : open)) {
    return null
  }

  const handleDismiss = () => {
    props.onDismissAction()
    setOpen(false)
  }

  return (
    <div className="fixed w-screen h-screen z-10">
      <div className="absolute w-full h-full bg-secondary opacity-60" />
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={handleDismiss}
      >
        <div
          className="bg-background max-w-xl mx-4 rounded-lg shadow overflow-hidden"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="p-6 space-y-4 ">
            <h1 className="text-2xl sans-serif font-semibold tracking-tight mb-7">
              OSS Vibe Coding Platform
            </h1>
            <p className="text-base text-primary">
              This is a <strong>demo</strong> of an end-to-end coding platform
              where the user can enter text prompts, and the agent will create a
              full stack application.
            </p>
            <p className="text-base text-secondary-foreground">
              It uses Vercel&quot;s AI Cloud services like{' '}
              <ExternalLink href="https://vercel.com/docs/vercel-sandbox">
                Sandbox
              </ExternalLink>{' '}
              for secure code execution,{' '}
              <ExternalLink href="https://vercel.com/docs/ai-gateway">
                AI Gateway
              </ExternalLink>{' '}
              for GPT-5 and other models support,{' '}
              <ExternalLink href="https://vercel.com/fluid">
                Fluid Compute
              </ExternalLink>{' '}
              for efficient rendering and streaming, and it&quot;s built with{' '}
              <ExternalLink href="https://nextjs.org/">Next.js</ExternalLink>{' '}
              and the{' '}
              <ExternalLink href="https://ai-sdk.dev/docs/introduction">
                AI SDK
              </ExternalLink>
              .
            </p>
          </div>
          <footer className="bg-secondary flex justify-end p-4 border-t border-border">
            <Button className="cursor-pointer" onClick={handleDismiss}>
              Try now
            </Button>
          </footer>
        </div>
      </div>
    </div>
  )
}

export function ToggleWelcome() {
  const { open, setOpen } = useWelcomeStore()
  return (
    <Button
      className="cursor-pointer"
      onClick={() => setOpen(!open)}
      variant="outline"
      size="sm"
    >
      <InfoIcon /> <span className="hidden lg:inline">What&quot;s this?</span>
    </Button>
  )
}

function ExternalLink({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) {
  return (
    <a
      className="underline underline-offset-3 text-primary"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  )
}
