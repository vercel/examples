'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, CheckCircle2, XCircle, Wrench } from 'lucide-react'
import { cn } from '~/lib/utils'
import type { DynamicToolUIPart, ToolUIPart } from 'ai'
import { getToolName } from 'ai'

type AnyToolUIPart = DynamicToolUIPart | ToolUIPart
import { parseMultiExecArgs } from '../tool-results/multi-exec/schema'
import { parseManageConnectionsArgs } from '../tool-results/connections/schema'
import { parseToolResult } from '../tool-results/envelope'

interface ToolInvocationProps {
  toolCall: AnyToolUIPart
  onClick?: () => void
}

function getToolDescription(toolCall: AnyToolUIPart): string | undefined {
  const args = (toolCall.input ?? {}) as Record<string, unknown>
  const name = getToolName(toolCall)

  if (name.endsWith('SEARCH_TOOLS')) {
    return 'Searching for the right tool'
  }

  if (name.endsWith('MULTI_EXECUTE_TOOL')) {
    if (typeof args.thought === 'string') return args.thought
    const parsed = parseMultiExecArgs(args)
    if (parsed && parsed.slugs.length > 0)
      return `Executing ${parsed.slugs.length} tools`
  }

  if (name.endsWith('MANAGE_CONNECTIONS')) {
    const parsed = parseManageConnectionsArgs(args)
    if (parsed) return parsed.toolkits.join(', ')
  }

  if (name.endsWith('REMOTE_WORKBENCH') && typeof args.thought === 'string') {
    return args.thought
  }

  if (name.endsWith('REMOTE_BASH_TOOL') && typeof args.command === 'string') {
    return args.command.length > 80
      ? args.command.slice(0, 80) + '\u2026'
      : args.command
  }

  return undefined
}

function getToolDisplayName(name: string): string {
  const prefixes = ['COMPOSIO_', 'RUBE_']
  for (const prefix of prefixes) {
    if (name.startsWith(prefix)) {
      return name.slice(prefix.length)
    }
  }
  return name
}

function isError(toolCall: AnyToolUIPart): boolean {
  if (toolCall.state === 'output-error') return true
  if (toolCall.state !== 'output-available') return false
  const parsed = parseToolResult(toolCall.output)
  if (!parsed) return false
  return (
    parsed.successful === false ||
    (typeof parsed.error === 'string' && parsed.error.length > 0)
  )
}

export function ToolInvocation({ toolCall, onClick }: ToolInvocationProps) {
  const toolName = getToolName(toolCall)
  const description = getToolDescription(toolCall)
  const displayName = getToolDisplayName(toolName)
  const isRunning =
    toolCall.state === 'input-streaming' || toolCall.state === 'input-available'
  const hasError = isError(toolCall)

  const startTimeRef = useRef(Date.now())
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!isRunning) {
      setElapsed(
        Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
      )
      return
    }

    const interval = setInterval(() => {
      setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex max-w-full items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors',
        'border-border bg-card hover:bg-accent',
        hasError && 'border-destructive/30'
      )}
      data-tool-call-id={toolCall.toolCallId}
    >
      {isRunning ? (
        <Loader2 className="text-chart-4 size-3.5 animate-spin" />
      ) : hasError ? (
        <XCircle className="text-destructive size-3.5" />
      ) : (
        <CheckCircle2 className="text-chart-2 size-3.5" />
      )}

      <span className="text-foreground shrink-0 font-medium">
        {displayName}
      </span>

      {description && (
        <span className="text-muted-foreground min-w-0 truncate">
          {description}
        </span>
      )}

      {elapsed > 0 && (
        <span className="text-muted-foreground/60 tabular-nums">
          {elapsed}s
        </span>
      )}

      <Wrench className="text-muted-foreground/40 size-3" />
    </button>
  )
}
