import type { BashUIPart } from '@/lib/types'
import { CheckIcon, TerminalIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { Loader } from '@/components/ai-elements/loader'
import { cn } from '@/lib/utils'

// Renders a single `bash` tool call as the agent issues it. The command is the
// `browse` invocation the model chose; the indicator reflects its result.
export function BashCall({ part }: { part: BashUIPart }) {
  const [expanded, setExpanded] = useState(false)

  const command = part.input?.command

  const running =
    part.state === 'input-streaming' || part.state === 'input-available'
  const output = part.state === 'output-available' ? part.output : undefined
  const failed =
    part.state === 'output-error' ||
    (output ? output.exitCode !== 0 : false)

  const result = output?.stdout?.trim() || output?.stderr?.trim() || ''

  return (
    <div className="rounded-md border border-border bg-muted/40 font-mono text-xs">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
        disabled={!result}
      >
        <TerminalIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <code className="flex-1 truncate text-foreground">
          {command ?? '…'}
        </code>
        <span className="shrink-0">
          {running ? (
            <Loader size={14} className="text-muted-foreground" />
          ) : failed ? (
            <XIcon className="size-4 text-destructive" />
          ) : (
            <CheckIcon className="size-4 text-emerald-600 dark:text-emerald-400" />
          )}
        </span>
      </button>
      {expanded && result && (
        <pre
          className={cn(
            'max-h-64 overflow-auto border-t border-border px-3 py-2 whitespace-pre-wrap break-words',
            failed ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {result}
        </pre>
      )}
    </div>
  )
}
