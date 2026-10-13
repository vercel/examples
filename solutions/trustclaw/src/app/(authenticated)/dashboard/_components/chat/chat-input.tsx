'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowUp, Square } from 'lucide-react'
import type { ChatStatus } from 'ai'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  onStop: () => void
  status: ChatStatus
}

const MAX_MESSAGE_LENGTH = 50_000

export function ChatInput({ onSend, onStop, status }: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isStreaming = status === 'streaming' || status === 'submitted'
  const isTooLong = input.length > MAX_MESSAGE_LENGTH
  const canSend = input.trim().length > 0 && !isStreaming && !isTooLong

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = useCallback(() => {
    if (!canSend) return
    onSend(input.trim())
    setInput('')
  }, [canSend, input, onSend])

  const handleStop = useCallback(() => {
    onStop()
  }, [onStop])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isStreaming) return
      handleSubmit()
    }
  }

  return (
    <div className="border-border bg-background border-t p-3 md:p-4">
      <div className="mx-auto flex max-w-2xl items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isStreaming ? 'Waiting for response...' : 'Ask me anything...'
          }
          disabled={isStreaming}
          rows={1}
          className={cn(
            'border-border bg-muted/50 max-h-[200px] min-h-[44px] resize-none rounded-xl text-base md:text-sm',
            'placeholder:text-muted-foreground/50',
            'focus-visible:ring-ring focus-visible:ring-1'
          )}
        />

        {isStreaming ? (
          <Button
            variant="default"
            size="icon"
            className="size-10 shrink-0 rounded-xl"
            onClick={handleStop}
          >
            <Square className="size-4 fill-current" />
          </Button>
        ) : (
          <Button
            variant="default"
            size="icon"
            className={cn(
              'size-10 shrink-0 rounded-xl',
              !canSend && 'opacity-50'
            )}
            onClick={handleSubmit}
            disabled={!canSend}
          >
            <ArrowUp className="size-4" />
          </Button>
        )}
      </div>
      {isTooLong && (
        <p className="text-destructive text-xs">
          Message is too long ({input.length.toLocaleString()}/
          {MAX_MESSAGE_LENGTH.toLocaleString()})
        </p>
      )}
    </div>
  )
}
