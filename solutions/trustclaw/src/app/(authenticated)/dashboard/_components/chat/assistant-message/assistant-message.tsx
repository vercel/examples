'use client'

import { useState, useRef, useEffect } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check } from 'lucide-react'
import type { UIMessage } from '@ai-sdk/react'
import type { ChatStatus, DynamicToolUIPart, ToolUIPart } from 'ai'
import { isToolUIPart } from 'ai'
import { ThinkingIndicator } from './thinking-indicator'
import { ToolCallSegment } from './tool-call-segment'
import { stripToolResultEchoes } from '~/server/api/routers/trustclaw/agent/strip-tool-echoes'
import { PROSE_CLASSES } from './prose-classes'

type TextUIPart = { type: 'text'; text: string }

type MessageSegment =
  | { kind: 'text'; parts: TextUIPart[] }
  | { kind: 'tool-call'; part: DynamicToolUIPart | ToolUIPart }

function segmentParts(parts: UIMessage['parts']): MessageSegment[] {
  const segments: MessageSegment[] = []
  let textAccum: TextUIPart[] = []

  for (const part of parts) {
    if (part.type === 'text') {
      textAccum.push(part)
    } else if (isToolUIPart(part)) {
      if (textAccum.length > 0) {
        segments.push({ kind: 'text', parts: textAccum })
        textAccum = []
      }
      segments.push({ kind: 'tool-call', part })
    }
  }
  if (textAccum.length > 0) {
    segments.push({ kind: 'text', parts: textAccum })
  }
  return segments
}

interface AssistantMessageProps {
  message: UIMessage
  status: ChatStatus
  onOpenTerminal: () => void
}

export function AssistantMessage({
  message,
  status,
  onOpenTerminal,
}: AssistantMessageProps) {
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  const segments = segmentParts(message.parts)

  const getFullTextContent = () =>
    segments
      .filter(
        (s): s is Extract<MessageSegment, { kind: 'text' }> => s.kind === 'text'
      )
      .map((s) => stripToolResultEchoes(s.parts.map((p) => p.text).join('')))
      .filter(Boolean)
      .join('\n')

  const hasTextContent = segments.some((s) => s.kind === 'text')

  const handleCopy = () => {
    void navigator.clipboard.writeText(getFullTextContent())
    setCopied(true)
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }

  if (segments.length === 0) {
    if (status === 'error') {
      return (
        <div className="text-destructive flex items-center gap-2 py-2 text-sm">
          <span>Something went wrong</span>
        </div>
      )
    }

    if (status === 'streaming' || status === 'submitted') {
      return <ThinkingIndicator />
    }

    return null
  }

  return (
    <div className="space-y-1">
      {segments.map((segment, idx) => {
        if (segment.kind === 'text') {
          const textContent = stripToolResultEchoes(
            segment.parts.map((p) => p.text).join('')
          )
          if (!textContent) return null

          return (
            <div key={`text-${idx}`}>
              <div className={`min-w-0 flex-1 ${PROSE_CLASSES}`}>
                <Markdown remarkPlugins={[remarkGfm]}>{textContent}</Markdown>
              </div>
            </div>
          )
        }

        return (
          <ToolCallSegment
            key={segment.part.toolCallId}
            toolCall={segment.part}
            onOpenTerminal={onOpenTerminal}
          />
        )
      })}

      {hasTextContent && (
        <button
          onClick={handleCopy}
          className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      )}
    </div>
  )
}
