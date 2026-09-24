'use client'

import { cn } from '~/lib/utils'
import Link from 'next/link'
import type { ConnectionResult, ConnectionToolResultData } from './schema'

export type { ConnectionToolResultData }

interface ConnectionToolResultProps {
  data: ConnectionToolResultData
}

function statusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'connected':
      return 'text-chart-2'
    case 'initiated':
    case 'pending':
      return 'text-chart-4'
    case 'error':
    case 'failed':
      return 'text-destructive'
    default:
      return 'text-muted-foreground'
  }
}

function statusDot(status: string): string {
  switch (status) {
    case 'active':
    case 'connected':
      return '●'
    case 'initiated':
    case 'pending':
      return '○'
    case 'error':
    case 'failed':
      return '✕'
    default:
      return '○'
  }
}

export function ConnectionToolResult({ data }: ConnectionToolResultProps) {
  const entries = data.toolkits
    .map((tk) => ({ toolkit: tk, result: data.results[tk] }))
    .filter(
      (e): e is { toolkit: string; result: ConnectionResult } => !!e.result
    )

  if (entries.length === 0) {
    return (
      <div className="text-muted-foreground font-mono text-xs">
        <span className="text-destructive">⊘</span> No connection results.
      </div>
    )
  }

  const sections: string[] = []
  for (const { toolkit, result } of entries) {
    sections.push(`status-${toolkit}`)
    if (result.redirect_url) sections.push(`auth-${toolkit}`)
  }
  const isLast = (key: string) => sections.indexOf(key) === sections.length - 1

  return (
    <div className="font-mono text-xs">
      <div className="border-border space-y-4 overflow-hidden border py-3 pr-3">
        {entries.map(({ toolkit, result }) => {
          const color = statusColor(result.status)
          const hasLink =
            !!result.redirect_url && result.redirect_url.startsWith('https://')

          return (
            <div key={toolkit} className="space-y-4">
              <div className="-ml-3 flex">
                <span className="text-muted-foreground w-6 shrink-0 text-center">
                  {isLast(`status-${toolkit}`) ? '└' : '├'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-muted-foreground/60 mb-0.5 text-[10px]">
                    {toolkit.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className={color}>{statusDot(result.status)}</span>
                    <span className={cn('font-semibold uppercase', color)}>
                      {result.status}
                    </span>
                    {result.was_reinitiated && (
                      <span className="text-muted-foreground/60">
                        • reinitiated
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {hasLink && (
                <div className="-ml-3 flex">
                  <span className="text-muted-foreground w-6 shrink-0 text-center">
                    {isLast(`auth-${toolkit}`) ? '└' : '├'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-primary mb-1.5 flex items-center gap-1.5 text-[10px] tracking-wider uppercase">
                      <span>→</span>
                      <span>Action Required</span>
                    </div>
                    <Link
                      href={result.redirect_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-primary/30 text-primary hover:bg-primary/10 inline-flex items-center gap-2 rounded border px-3 py-1.5 text-[11px] transition-colors"
                    >
                      Connect {toolkit}
                      <span className="text-primary/50">↗</span>
                    </Link>
                    <div className="text-muted-foreground/60 mt-1.5 flex items-center gap-1 text-[10px]">
                      <span>⏱</span>
                      <span>Link expires in 10 minutes</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
