'use client'

import { useState, useRef, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'
import type { UIMessage } from '@ai-sdk/react'

interface UserMessageProps {
  message: UIMessage
}

export function UserMessage({ message }: UserMessageProps) {
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  const textContent = message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('\n')

  const handleCopy = () => {
    void navigator.clipboard.writeText(textContent)
    setCopied(true)
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-end">
      <div className="relative max-w-[80%]">
        <div className="rounded-2xl bg-muted px-3 py-2 text-sm text-foreground">
          <p className="whitespace-pre-wrap">{textContent}</p>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="mt-1 mr-1 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
      >
        {copied ? (
          <Check className="size-3.5" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  )
}
