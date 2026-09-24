'use client'

import { ExternalLink, Check } from 'lucide-react'
import { getToolName } from 'ai'
import type { DynamicToolUIPart, ToolUIPart } from 'ai'
import { ToolInvocation } from '../../terminal/tool-invocation'
import Link from 'next/link'
import { parseManageConnectionsResult } from '../../tool-results/connections/schema'
import { trpc } from '~/clients/trpc'

interface InlineConnectionAction {
  toolkit: string
  redirectUrl: string
}

function getInlineConnectionActions(
  toolCall: DynamicToolUIPart | ToolUIPart
): InlineConnectionAction[] {
  const toolName = getToolName(toolCall)
  if (!toolName.endsWith('MANAGE_CONNECTIONS')) return []
  if (toolCall.state !== 'output-available' || !toolCall.output) return []

  const args = (toolCall.input ?? {}) as Record<string, unknown>
  const parsed = parseManageConnectionsResult(toolCall.output, args)
  if (!parsed) return []

  const actions: InlineConnectionAction[] = []
  for (const [toolkit, entry] of Object.entries(parsed.results)) {
    if (entry.redirect_url?.startsWith('https://')) {
      actions.push({ toolkit, redirectUrl: entry.redirect_url })
    }
  }
  return actions
}

interface ToolCallSegmentProps {
  toolCall: DynamicToolUIPart | ToolUIPart
  onOpenTerminal: () => void
}

export function ToolCallSegment({
  toolCall,
  onOpenTerminal,
}: ToolCallSegmentProps) {
  const connectionActions = getInlineConnectionActions(toolCall)

  const allToolkits = connectionActions.map((a) => a.toolkit)

  const connectionStatus = trpc.trustclaw.checkConnectionStatus.useQuery(
    { toolkits: allToolkits },
    {
      enabled: allToolkits.length > 0,
    }
  )

  const connectedToolkits = new Set(
    connectionStatus.data?.statuses
      .filter((s) => s.connected)
      .map((s) => s.toolkit) ?? []
  )

  const handleClick = () => {
    onOpenTerminal()
    window.dispatchEvent(
      new CustomEvent('tool-focus', {
        detail: { toolCallId: toolCall.toolCallId },
      })
    )
  }

  return (
    <div className="my-2 space-y-2">
      <ToolInvocation toolCall={toolCall} onClick={handleClick} />
      {connectionActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {connectionActions.map((action) =>
            connectedToolkits.has(action.toolkit) ? (
              <span
                key={action.toolkit}
                className="text-primary border-primary/30 bg-primary/5 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium"
              >
                <Check className="size-3" />
                {action.toolkit} connected
              </span>
            ) : (
              <Link
                key={action.toolkit}
                href={action.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
              >
                Connect {action.toolkit}
                <ExternalLink className="size-3" />
              </Link>
            )
          )}
        </div>
      )}
    </div>
  )
}
