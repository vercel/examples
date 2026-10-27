'use client'

import { useState } from 'react'
import { cn } from '~/lib/utils'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '~/components/ui/collapsible'
import type { SearchToolResultData } from './schema'

export type { SearchToolResultData }

interface SearchToolResultProps {
  data: SearchToolResultData
}

function parsePitfall(raw: string): { tool: string; message: string } {
  const match = /^\[([^\]]+)\]\s*(.*)/.exec(raw)
  if (match) {
    return { tool: match[1] ?? '', message: match[2] ?? raw }
  }
  return { tool: '', message: raw }
}

interface ParsedPlanStep {
  required: boolean
  label: string
  description: string
}

function parsePlanStep(raw: string): ParsedPlanStep {
  const match =
    /^\[(Required|Optional)(?:\s*\([^)]*\))?\]\s*\[([^\]]+)\]:\s*(.+)/i.exec(
      raw
    )
  if (match) {
    return {
      required: match[1]?.toLowerCase() === 'required',
      label: match[2] ?? '',
      description: match[3] ?? raw,
    }
  }
  return { required: false, label: '', description: raw }
}

function getPitfallsForTool(pitfalls: string[], toolSlug: string): string[] {
  return pitfalls
    .map(parsePitfall)
    .filter((p) => p.tool === toolSlug)
    .map((p) => p.message)
}

function DifficultyBadge({ level }: { level: string }) {
  const levels: Record<string, number> = { easy: 1, medium: 2, hard: 3 }
  const filled = levels[level] ?? 1
  const colors: Record<string, string> = {
    easy: 'text-chart-2',
    medium: 'text-chart-4',
    hard: 'text-destructive',
  }
  const color = colors[level] ?? 'text-muted-foreground'

  return (
    <span className="flex items-center gap-1.5 text-[10px]">
      <span className="tracking-wider">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={i <= filled ? color : 'text-muted-foreground/30'}
          >
            ■
          </span>
        ))}
      </span>
      <span className={cn('uppercase', color)}>{level}</span>
    </span>
  )
}

export function SearchToolResult({ data }: SearchToolResultProps) {
  const [showMore, setShowMore] = useState(false)
  const [showAllSteps, setShowAllSteps] = useState(false)
  const [showAllPitfalls, setShowAllPitfalls] = useState(false)

  const result = data.results[0]

  if (!result) {
    return (
      <div className="font-mono text-xs text-muted-foreground">
        <span className="text-destructive">⊘</span> No results found.
      </div>
    )
  }

  const primaryTool = result.primary_tool_slugs?.[0]
  const primarySchema = primaryTool ? data.tool_schemas[primaryTool] : null
  const relatedTools = result.related_tool_slugs ?? []
  const connection = data.toolkit_connection_statuses[0]

  const allPitfalls = result.known_pitfalls ?? []
  const primaryPitfalls = primaryTool
    ? getPitfallsForTool(allPitfalls, primaryTool)
    : []
  const hasTips = primaryPitfalls.length > 0
  const hasDescription = !!primarySchema?.description

  const planSteps = (result.recommended_plan_steps ?? []).map(parsePlanStep)
  const hasPlan = planSteps.length > 0
  const nextSteps = data.next_steps_guidance ?? []

  const isConnected = connection?.has_active_connection ?? false

  return (
    <div className="font-mono text-xs">
      <div className="space-y-4 border border-border py-3 pr-3">
        <div className="-ml-3 flex">
          <span className="w-6 shrink-0 text-center text-muted-foreground">
            ├
          </span>
          <div className="flex-1">
            <div className="mb-0.5 text-[10px] text-muted-foreground/60">
              USE CASE
            </div>
            <div className="text-sm font-semibold uppercase text-foreground/90">
              {result.use_case}
            </div>
          </div>
        </div>

        {connection && (
          <div className="-ml-3 flex">
            <span className="w-6 shrink-0 text-center text-muted-foreground">
              ├
            </span>
            <div className="flex-1">
              <div className="mb-0.5 text-[10px] text-muted-foreground/60">
                {connection.toolkit.toUpperCase()}
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                {isConnected ? (
                  <>
                    <span className="text-chart-2">●</span>
                    <span className="text-chart-2">CONNECTED</span>
                    {(connection.current_user_info?.emailAddress ??
                      connection.current_user_info?.login) && (
                      <span className="text-muted-foreground/60">
                        →{' '}
                        {connection.current_user_info?.emailAddress ??
                          connection.current_user_info?.login}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-destructive">○</span>
                    <span className="text-destructive">DISCONNECTED</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="-ml-3 flex">
          <span className="w-6 shrink-0 text-center text-muted-foreground">
            {hasPlan ? '├' : '└'}
          </span>
          <div className="flex-1">
            <div className="mb-0.5 text-[10px] text-muted-foreground/60">
              RECOMMENDED TOOL
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground/90">
                {primaryTool ?? 'No tool found'}
              </span>
              {result.difficulty && (
                <DifficultyBadge level={result.difficulty} />
              )}
            </div>

            {hasDescription && (
              <div className="mt-3 space-y-5">
                <div>
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary">
                    <span>?</span>
                    <span>Description</span>
                  </div>
                  <p className="border-l border-border pl-2 text-[11px] leading-relaxed text-muted-foreground">
                    {primarySchema?.description}
                  </p>
                </div>

                <div>
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-chart-4">
                    <span>!</span>
                    <span>
                      Known Pitfalls {hasTips && `(${primaryPitfalls.length})`}
                    </span>
                  </div>
                  <div className="border-l border-border pl-2">
                    {hasTips ? (
                      <>
                        <div className="space-y-1.5">
                          {(showAllPitfalls
                            ? primaryPitfalls
                            : primaryPitfalls.slice(0, 2)
                          ).map((msg, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-[11px]"
                            >
                              <span className="shrink-0 text-chart-4">-</span>
                              <span className="leading-relaxed text-muted-foreground">
                                {msg}
                              </span>
                            </div>
                          ))}
                        </div>
                        {primaryPitfalls.length > 2 && (
                          <button
                            onClick={() => setShowAllPitfalls((v) => !v)}
                            className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                          >
                            <span
                              className={cn(
                                'transition-transform duration-200',
                                showAllPitfalls && 'rotate-90'
                              )}
                            >
                              ▸
                            </span>
                            <span className="uppercase tracking-wider">
                              {showAllPitfalls
                                ? 'Show less'
                                : `${primaryPitfalls.length - 2} more pitfalls`}
                            </span>
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-[11px] italic text-muted-foreground/60">
                        No known pitfalls
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {hasPlan && (
          <div className="-ml-3 flex">
            <span className="w-6 shrink-0 text-center text-muted-foreground">
              └
            </span>
            <div className="flex-1">
              <div className="mb-0.5 text-[10px] text-muted-foreground/60">
                RECOMMENDED PLAN
              </div>
              {result.execution_guidance && (
                <p className="mb-3 text-[11px] leading-relaxed text-muted-foreground/70">
                  {result.execution_guidance}
                </p>
              )}
              <div className="space-y-1">
                {(showAllSteps ? planSteps : planSteps.slice(0, 3)).map(
                  (step, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <span
                        className={cn(
                          'mt-px shrink-0 text-[10px] font-semibold',
                          step.required
                            ? 'text-primary'
                            : 'text-muted-foreground/50'
                        )}
                      >
                        {i + 1}.
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="leading-relaxed text-muted-foreground">
                          {step.label && (
                            <span
                              className={cn(
                                'mr-1.5 inline-block rounded-sm px-1 py-px text-[9px] uppercase tracking-wider',
                                step.required
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-muted text-muted-foreground/60'
                              )}
                            >
                              {step.required ? step.label : `${step.label}`}
                            </span>
                          )}
                          {step.description}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
              {planSteps.length > 3 && (
                <button
                  onClick={() => setShowAllSteps((v) => !v)}
                  className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                >
                  <span
                    className={cn(
                      'transition-transform duration-200',
                      showAllSteps && 'rotate-90'
                    )}
                  >
                    ▸
                  </span>
                  <span className="uppercase tracking-wider">
                    {showAllSteps
                      ? 'Show less'
                      : `${planSteps.length - 3} more steps`}
                  </span>
                </button>
              )}

              {nextSteps.length > 0 && (
                <div className="mt-4">
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-chart-2">
                    <span>→</span>
                    <span>Next Steps</span>
                  </div>
                  <div className="border-l border-border pl-2">
                    <div className="space-y-1">
                      {nextSteps.map((step, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-[11px]"
                        >
                          <span className="shrink-0 text-chart-2">-</span>
                          <span className="leading-relaxed text-muted-foreground">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {relatedTools.length > 0 && (
        <Collapsible open={showMore} onOpenChange={setShowMore}>
          <CollapsibleTrigger asChild>
            <button className="group mt-3 flex w-full items-center gap-2 text-[10px] text-muted-foreground/60 transition-colors hover:text-muted-foreground">
              <span className="transition-transform duration-200 group-data-[state=open]:rotate-90">
                ▸
              </span>
              <span className="uppercase tracking-wider">
                {relatedTools.length} related tools
              </span>
              <span className="flex-1 overflow-hidden text-border">
                {'─'.repeat(50)}
              </span>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="mt-2 space-y-1.5">
              {relatedTools.map((tool, i) => {
                const schema = data.tool_schemas[tool]
                const isLast = i === relatedTools.length - 1
                return (
                  <div
                    key={tool}
                    className="flex py-1 transition-colors hover:bg-accent/30"
                  >
                    <span className="shrink-0 text-[10px] text-muted-foreground/60">
                      {isLast ? '└─ ' : '├─ '}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {tool}
                      </span>
                      {schema?.description && (
                        <p className="mt-0.5 line-clamp-1 text-[10px] text-muted-foreground/60">
                          {schema.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
