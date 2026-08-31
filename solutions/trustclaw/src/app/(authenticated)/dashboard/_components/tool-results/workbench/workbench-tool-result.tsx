'use client'

import { useState } from 'react'
import { cn } from '~/lib/utils'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '~/components/ui/collapsible'
import type { WorkbenchToolResultData } from './schema'

export type { WorkbenchToolResultData }

interface WorkbenchToolResultProps {
  data: WorkbenchToolResultData
}

export function WorkbenchToolResult({ data }: WorkbenchToolResultProps) {
  const [codeOpen, setCodeOpen] = useState(true)
  const [outputOpen, setOutputOpen] = useState(false)

  const hasStep = data.currentStep ?? data.stepMetric
  const hasOutput = !!data.stdout
  const hasStderr = !!data.stderr
  const hasError = !!data.error
  const hasCode = !!data.code

  const sections: string[] = []
  if (hasStep) sections.push('step')
  if (data.thought) sections.push('thought')
  if (hasCode) sections.push('code')
  if (hasOutput || hasStderr || hasError) sections.push('output')

  const isLast = (section: string) =>
    sections.indexOf(section) === sections.length - 1

  return (
    <div className="font-mono text-xs">
      <div className="space-y-4 overflow-hidden border border-border py-3 pr-3">
        {hasStep && (
          <div className="-ml-3 flex">
            <span className="w-6 shrink-0 text-center text-muted-foreground">
              {isLast('step') ? '└' : '├'}
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 text-[10px] text-muted-foreground/60">
                STEP
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                {data.currentStep && (
                  <span className="uppercase">
                    {data.currentStep.replace(/_/g, ' ')}
                  </span>
                )}
                {data.stepMetric && (
                  <>
                    <span className="text-muted-foreground/60">•</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {data.stepMetric}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {data.thought && (
          <div className="-ml-3 flex">
            <span className="w-6 shrink-0 text-center text-muted-foreground">
              {isLast('thought') ? '└' : '├'}
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 text-[10px] text-muted-foreground/60">
                THOUGHT
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {data.thought}
              </p>
            </div>
          </div>
        )}

        {hasCode && (
          <div className="-ml-3 flex">
            <span className="w-6 shrink-0 text-center text-muted-foreground">
              {isLast('code') ? '└' : '├'}
            </span>
            <div className="min-w-0 flex-1">
              <Collapsible open={codeOpen} onOpenChange={setCodeOpen}>
                <CollapsibleTrigger asChild>
                  <button className="group flex items-center gap-2 text-[10px] text-muted-foreground/60 transition-colors hover:text-muted-foreground">
                    <span className="transition-transform duration-200 group-data-[state=open]:rotate-90">
                      ▸
                    </span>
                    <span className="uppercase tracking-wider">
                      {data.type === 'bash' ? 'COMMAND' : 'CODE'}
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="mt-1.5 max-h-60 overflow-auto rounded border border-border p-3 text-[11px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {data.code}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        )}

        {(hasOutput || hasStderr || hasError) && (
          <div className="-ml-3 flex">
            <span className="w-6 shrink-0 text-center text-muted-foreground">
              └
            </span>
            <div className="min-w-0 flex-1">
              <Collapsible open={outputOpen} onOpenChange={setOutputOpen}>
                <CollapsibleTrigger asChild>
                  <button className="group flex items-center gap-2 text-[10px] text-muted-foreground/60 transition-colors hover:text-muted-foreground">
                    <span className="transition-transform duration-200 group-data-[state=open]:rotate-90">
                      ▸
                    </span>
                    <span
                      className={cn(
                        'uppercase tracking-wider',
                        hasError || hasStderr
                          ? 'text-destructive'
                          : 'text-chart-2'
                      )}
                    >
                      Output
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-1.5 space-y-3">
                    {hasOutput && (
                      <pre className="max-h-80 overflow-auto rounded border border-border p-3 text-[11px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {data.stdout}
                      </pre>
                    )}

                    {hasStderr && (
                      <div>
                        <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-destructive">
                          <span>!</span>
                          <span>Stderr</span>
                        </div>
                        <pre
                          className={cn(
                            'max-h-40 overflow-auto rounded border p-3 text-[11px] leading-relaxed whitespace-pre-wrap',
                            'border-destructive/30 text-destructive/70'
                          )}
                        >
                          {data.stderr}
                        </pre>
                      </div>
                    )}

                    {hasError && (
                      <div>
                        <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-destructive">
                          <span>✕</span>
                          <span>Error</span>
                        </div>
                        <pre
                          className={cn(
                            'max-h-40 overflow-auto rounded border p-3 text-[11px] leading-relaxed whitespace-pre-wrap',
                            'border-destructive/30 text-destructive/70'
                          )}
                        >
                          {data.error}
                        </pre>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
