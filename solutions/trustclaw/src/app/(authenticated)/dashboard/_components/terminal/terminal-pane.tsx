'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { PanelRightClose, Terminal } from 'lucide-react'
import type { UIMessage } from '@ai-sdk/react'
import type { ChatStatus } from 'ai'
import { isToolUIPart } from 'ai'
import { TerminalLogEntry } from './terminal-log-entry'
import { toolCallToLogEntry } from './types'
import type { TerminalLogEntryData } from './types'

export function useToolFocusHighlight() {
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ toolCallId: string }>).detail
      if (detail?.toolCallId) {
        requestAnimationFrame(() => {
          const el = document.getElementById(`tool-log-${detail.toolCallId}`)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            el.classList.add('ring-1', 'ring-chart-4/60')
            setTimeout(() => {
              el.classList.remove('ring-1', 'ring-chart-4/60')
            }, 1500)
          }
        })
      }
    }

    window.addEventListener('tool-focus', handler)
    return () => window.removeEventListener('tool-focus', handler)
  }, [])
}

export function useToolCallCount(messages: UIMessage[]): number {
  return useMemo(() => {
    let count = 0
    for (const msg of messages) {
      if (msg.role !== 'assistant') continue
      for (const part of msg.parts) {
        if (isToolUIPart(part)) count++
      }
    }
    return count
  }, [messages])
}

interface TerminalPaneProps {
  messages: UIMessage[]
  status: ChatStatus
  onHide?: () => void
}

export function TerminalPane({ messages, status, onHide }: TerminalPaneProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isAutoScroll, setIsAutoScroll] = useState(true)

  useToolFocusHighlight()
  const toolCount = useToolCallCount(messages)

  const logEntries = useMemo(() => {
    const entries: TerminalLogEntryData[] = []
    for (const msg of messages) {
      if (msg.role !== 'assistant') continue
      for (const part of msg.parts) {
        if (isToolUIPart(part)) {
          entries.push(toolCallToLogEntry(part, status))
        }
      }
    }
    return entries
  }, [messages, status])

  const lastToolCallIdRef = useRef<string | null>(null)
  useEffect(() => {
    const lastEntry = logEntries[logEntries.length - 1]
    if (!lastEntry) return
    if (lastEntry.id === lastToolCallIdRef.current) return
    lastToolCallIdRef.current = lastEntry.id

    window.dispatchEvent(
      new CustomEvent('tool-focus', {
        detail: { toolCallId: lastEntry.id },
      })
    )
  }, [logEntries])

  useEffect(() => {
    if (isAutoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logEntries, isAutoScroll])

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
    setIsAutoScroll(isAtBottom)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Terminal className="size-4 text-muted-foreground" />
        <span className="font-mono text-xs font-medium text-foreground">
          Tool Execution
        </span>
        {toolCount > 0 && (
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {toolCount} call{toolCount !== 1 ? 's' : ''}
          </span>
        )}
        {onHide && (
          <button
            onClick={onHide}
            className="ml-auto inline-flex items-center gap-1.5 rounded-md p-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <PanelRightClose className="size-4" />
            Hide
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-5 py-2"
      >
        {logEntries.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center font-mono text-xs text-muted-foreground/40">
              <Terminal className="mx-auto mb-2 size-8" />
              <p>Tool calls will appear here</p>
            </div>
          </div>
        ) : (
          logEntries.map((log) => <TerminalLogEntry key={log.id} log={log} />)
        )}
      </div>
    </div>
  )
}
