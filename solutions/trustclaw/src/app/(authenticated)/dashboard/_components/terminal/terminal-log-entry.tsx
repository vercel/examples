'use client'

import moment from 'moment'
import { Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils'
import { SearchToolResult } from '../tool-results/search-tools/search-tool-result'
import { WorkbenchToolResult } from '../tool-results/workbench/workbench-tool-result'
import { ConnectionToolResult } from '../tool-results/connections/connection-tool-result'
import { getSearchToolData } from '../tool-results/search-tools/schema'
import { getWorkbenchData } from '../tool-results/workbench/schema'
import { getConnectionData } from '../tool-results/connections/schema'
import { getMultiExecInfo } from '../tool-results/multi-exec/schema'

import type { TerminalLogEntryData } from './types'

export type { TerminalLogEntryData } from './types'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTimestamp(date: Date): string {
  return moment(date).format('HH:mm:ss')
}

function formatJson(obj: unknown): string {
  if (!obj) return ''
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return '[Object]'
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export function TerminalLogEntry({ log }: { log: TerminalLogEntryData }) {
  const statusColors = {
    complete: 'text-chart-2',
    error: 'text-destructive',
    executing: 'text-chart-4',
  }

  const hasArgs = Object.keys(log.args).length > 0
  const hasResult = log.result !== undefined

  const multiExec = getMultiExecInfo(log)
  const searchToolData = getSearchToolData(log)
  const workbenchData = getWorkbenchData(log)
  const connectionData = getConnectionData(log)

  const hasSubErrors =
    multiExec?.tools.some((t) => t.status === 'error') ?? false
  const effectiveStatus =
    log.status === 'complete' && hasSubErrors ? 'error' : log.status

  return (
    <div
      id={`tool-log-${log.id}`}
      className="border-b border-border/50 py-3 font-mono text-xs transition-all last:border-0"
    >
      <div className="flex w-full items-center gap-2 text-left">
        <span className="text-muted-foreground/60">{'>'}</span>
        <span className="text-sm font-semibold text-foreground/90">
          {log.toolName}
        </span>
        <span className={cn('ml-auto shrink-0', statusColors[effectiveStatus])}>
          {effectiveStatus === 'executing' ? (
            <Loader2 className="size-3 animate-spin" />
          ) : effectiveStatus === 'complete' ? (
            'Done'
          ) : (
            'Error'
          )}
        </span>
        <span className="shrink-0 text-muted-foreground/60">
          {formatTimestamp(log.timestamp)}
        </span>
      </div>

      {multiExec && (
        <div className="mt-1.5 space-y-0 pl-5">
          {multiExec.thought && (
            <div className="py-1 text-muted-foreground">
              {multiExec.thought}
            </div>
          )}
          {multiExec.tools.map((tool, i) => (
            <div
              key={i}
              className="border-b border-border/30 py-1 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-[10px] text-muted-foreground/60">
                  └
                </span>
                <span
                  className={cn(
                    'min-w-0 truncate font-semibold',
                    tool.status === 'error'
                      ? 'text-destructive'
                      : 'text-foreground/90'
                  )}
                >
                  {tool.slug}
                </span>
                <span
                  className={cn(
                    'ml-auto shrink-0',
                    tool.status === 'success'
                      ? 'text-chart-2'
                      : tool.status === 'error'
                      ? 'text-destructive'
                      : 'text-chart-4'
                  )}
                >
                  {tool.status === 'success'
                    ? 'Done'
                    : tool.status === 'error'
                    ? 'Error'
                    : 'Pending'}
                </span>
              </div>
              {tool.error && (
                <div className="mt-0.5 pl-5 text-[10px] text-destructive/70">
                  {tool.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {multiExec && (hasResult || log.status === 'executing') && (
        <div className="ml-5 mt-2 max-h-60 overflow-y-auto rounded border border-border p-3">
          {hasResult && (
            <div>
              <span className="text-chart-2">◂ Result:</span>
              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-muted-foreground">
                {formatJson(log.result)}
              </pre>
            </div>
          )}
          {!hasResult && log.status === 'executing' && (
            <span className="text-chart-4">◂ Awaiting response…</span>
          )}
        </div>
      )}

      {!multiExec && searchToolData && (
        <div className="ml-5 mt-3">
          <SearchToolResult data={searchToolData} />
        </div>
      )}

      {!multiExec && !searchToolData && workbenchData && (
        <div className="ml-5 mt-3">
          <WorkbenchToolResult data={workbenchData} />
        </div>
      )}

      {!multiExec && !searchToolData && !workbenchData && connectionData && (
        <div className="ml-5 mt-3">
          <ConnectionToolResult data={connectionData} />
        </div>
      )}

      {!multiExec &&
        !searchToolData &&
        !workbenchData &&
        !connectionData &&
        (hasArgs || hasResult || log.status === 'executing') && (
          <div className="ml-5 mt-2 max-h-60 overflow-y-auto rounded border border-border p-3">
            {hasArgs && (
              <div>
                <span className="text-chart-4">▸ Args:</span>
                <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-muted-foreground">
                  {formatJson(log.args)}
                </pre>
              </div>
            )}
            {hasResult && (
              <div
                className={cn(hasArgs && 'mt-3 border-t border-border pt-3')}
              >
                <span className="text-chart-2">◂ Result:</span>
                <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-muted-foreground">
                  {formatJson(log.result)}
                </pre>
              </div>
            )}
            {log.status === 'executing' && !hasResult && (
              <div
                className={cn(hasArgs && 'mt-3 border-t border-border pt-3')}
              >
                <span className="text-chart-4">◂ Awaiting response…</span>
              </div>
            )}
          </div>
        )}
    </div>
  )
}
