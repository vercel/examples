import Image from 'next/image'
import { CheckCircle2, Wrench } from 'lucide-react'
import { TrustClawBrand } from './trustclaw-brand'

function ToolBadge({
  name,
  description,
  duration,
  delay,
}: {
  name: string
  description: string
  duration: string
  delay: number
}) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs"
      style={{ animation: `fade-in-up 0.3s ease-out ${delay}s both` }}
    >
      <CheckCircle2 className="size-3.5 shrink-0 text-chart-2" />
      <span className="font-medium text-foreground">{name}</span>
      <span className="truncate text-muted-foreground">{description}</span>
      <span className="tabular-nums text-muted-foreground/60">{duration}</span>
      <Wrench className="size-3 shrink-0 text-muted-foreground/40" />
    </div>
  )
}

function SearchResult({ delay }: { delay: number }) {
  return (
    <div
      className="font-mono text-xs"
      style={{ animation: `fade-in-up 0.3s ease-out ${delay}s both` }}
    >
      <div className="space-y-2 rounded-lg border border-border bg-background py-2.5 pr-3">
        <div className="-ml-0.5 flex">
          <span className="w-5 shrink-0 text-center text-muted-foreground">
            ├
          </span>
          <div>
            <div className="text-[10px] text-muted-foreground/60">USE CASE</div>
            <div className="text-[11px] font-semibold uppercase text-foreground/90">
              Fetch and categorize emails
            </div>
          </div>
        </div>
        <div className="-ml-0.5 flex">
          <span className="w-5 shrink-0 text-center text-muted-foreground">
            ├
          </span>
          <div>
            <div className="text-[10px] text-muted-foreground/60">GMAIL</div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-chart-2">●</span>
              <span className="text-chart-2">CONNECTED</span>
              <span className="text-muted-foreground/60">
                → sarah@company.com
              </span>
            </div>
          </div>
        </div>
        <div className="-ml-0.5 flex">
          <span className="w-5 shrink-0 text-center text-muted-foreground">
            └
          </span>
          <div>
            <div className="text-[10px] text-muted-foreground/60">
              RECOMMENDED TOOL
            </div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logos/gmail.svg"
                alt="Gmail"
                width={12}
                height={12}
                className="shrink-0"
              />
              <span className="text-[11px] font-semibold text-foreground/90">
                GMAIL_FETCH_EMAILS
              </span>
              <span className="flex items-center gap-1 text-[10px]">
                <span className="tracking-wider">
                  <span className="text-chart-2">■</span>
                  <span className="text-muted-foreground/30">■</span>
                  <span className="text-muted-foreground/30">■</span>
                </span>
                <span className="uppercase text-chart-2">easy</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const EXEC_TOOLS = [
  { slug: 'GMAIL_FETCH_EMAILS', icon: 'gmail' },
  { slug: 'GMAIL_CREATE_DRAFT', icon: 'gmail' },
  { slug: 'NOTION_CREATE_PAGE', icon: 'notion' },
]

function ExecResult({ delay }: { delay: number }) {
  return (
    <div
      className="font-mono text-xs"
      style={{ animation: `fade-in-up 0.3s ease-out ${delay}s both` }}
    >
      <div className="rounded-lg border border-border bg-background p-3">
        {EXEC_TOOLS.map((tool, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border-b border-border/30 py-1 last:border-0"
          >
            <span className="shrink-0 text-[10px] text-muted-foreground/60">
              └
            </span>
            <Image
              src={`/images/logos/${tool.icon}.svg`}
              alt={tool.icon}
              width={14}
              height={14}
              className="shrink-0"
            />
            <span className="min-w-0 truncate font-semibold text-foreground/90">
              {tool.slug}
            </span>
            <span className="ml-auto shrink-0 text-chart-2">Done</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChatMockup() {
  return (
    <div
      className="w-full max-w-md lg:max-w-lg"
      style={{ animation: 'fade-in-right 0.7s ease-out 0.5s both' }}
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="border-b border-border px-4 py-3">
          <TrustClawBrand size="sm" />
        </div>

        <div className="flex flex-col gap-2.5 p-4">
          {/* User message */}
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-xl rounded-tr-sm bg-muted px-3.5 py-2.5">
              <p className="text-sm text-foreground">
                plz handle my customer complaints and log in notion
              </p>
            </div>
          </div>

          {/* SEARCH_TOOLS */}
          <ToolBadge
            name="SEARCH_TOOLS"
            description="Finding the right tool"
            duration="1s"
            delay={0.9}
          />

          <SearchResult delay={1.3} />

          {/* MULTI_EXECUTE_TOOL */}
          <ToolBadge
            name="EXECUTE"
            description="Executing 3 tools"
            duration="2s"
            delay={1.7}
          />

          <ExecResult delay={2.1} />

          {/* Final summary */}
          <div
            className="max-w-[85%]"
            style={{ animation: 'fade-in 0.4s ease-out 2.5s both' }}
          >
            <p className="text-sm text-foreground">
              Drafted 3 replies and logged each complaint in your Notion
              tracker.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
