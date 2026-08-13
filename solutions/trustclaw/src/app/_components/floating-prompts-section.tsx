import Image from 'next/image'
import { AnimateOnView } from '~/components/core/animate-on-view'

interface Prompt {
  text: string
  icons: string[]
}

const PROMPTS: Prompt[] = [
  {
    text: 'Check my Gmail for all customer emails this month, categorize by complaint vs feature request...',
    icons: ['gmail', 'notion'],
  },
  {
    text: 'Pull all Reddit threads mentioning [competitor] from the last 3 months, analyze sentiment...',
    icons: ['reddit', 'googledocs'],
  },
  {
    text: 'Summarize all Slack messages in #product-feedback from this week...',
    icons: ['slack', 'linear'],
  },
  {
    text: 'Scrape G2 and Capterra reviews for our top 5 competitors...',
    icons: ['googlesheets'],
  },
  {
    text: "Pull this sprint's completed tickets from Linear, draft release notes...",
    icons: ['linear', 'googlesheets'],
  },
  {
    text: 'Analyze our Supabase user_events table, identify drop-off patterns...',
    icons: ['supabase', 'notion'],
  },
]

const PROMPT_POSITIONS = [
  { top: '2%', left: '2%', delay: 0 },
  { top: '0%', left: '52%', delay: 0.3 },
  { top: '28%', left: '18%', delay: 0.1 },
  { top: '26%', left: '56%', delay: 0.4 },
  { top: '52%', left: '4%', delay: 0.2 },
  { top: '50%', left: '46%', delay: 0.5 },
] as const

const APP_ICONS = [
  'gmail',
  'slack',
  'github',
  'notion',
  'linear',
  'figma',
  'googledrive',
  'jira',
  'trello',
  'asana',
  'googlesheets',
  'discord',
] as const

const ICON_POSITIONS = [
  { top: '5%', left: '2%' },
  { top: '3%', left: '40%' },
  { top: '7%', left: '78%' },
  { top: '10%', left: '92%' },
  { top: '30%', left: '0%' },
  { top: '45%', left: '90%' },
  { top: '55%', left: '3%' },
  { top: '50%', left: '85%' },
  { top: '75%', left: '15%' },
  { top: '78%', left: '70%' },
  { top: '80%', left: '92%' },
  { top: '85%', left: '40%' },
] as const

export function FloatingPromptsSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <AnimateOnView
          as="h2"
          className="text-foreground mb-12 text-center text-2xl font-bold tracking-tight md:mb-20 md:text-3xl lg:text-4xl"
        >
          All your favourite apps. <span className="italic">Zero setup.</span>
        </AnimateOnView>

        {/* Desktop: floating layout */}
        <div className="relative hidden min-h-[520px] lg:block">
          {/* Background app icons */}
          {APP_ICONS.map((slug, i) => {
            const pos = ICON_POSITIONS[i]!
            return (
              <div
                key={slug}
                className="pointer-events-none absolute opacity-20"
                style={{
                  top: pos.top,
                  left: pos.left,
                  animation: `fade-in 1s ease-out ${i * 0.05}s both`,
                }}
              >
                <Image
                  src={`/images/logos/${slug}.svg`}
                  alt=""
                  aria-hidden
                  width={32}
                  height={32}
                  style={{ width: 32, height: 32 }}
                />
              </div>
            )
          })}

          {/* Floating prompt cards */}
          {PROMPTS.map((prompt, i) => {
            const pos = PROMPT_POSITIONS[i]!
            return (
              <div
                key={i}
                className="bg-card border-border absolute max-w-xs rounded-xl border px-4 py-3 shadow-sm"
                style={{
                  top: pos.top,
                  left: pos.left,
                  animation: `fade-in-up 0.5s ease-out ${
                    0.2 + pos.delay
                  }s both, float-y-sm ${5 + i * 0.5}s ease-in-out ${
                    0.2 + pos.delay
                  }s infinite`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                    {prompt.icons.map((slug) => (
                      <Image
                        key={slug}
                        src={`/images/logos/${slug}.svg`}
                        alt=""
                        aria-hidden
                        width={18}
                        height={18}
                        style={{ width: 18, height: 18 }}
                      />
                    ))}
                  </div>
                  <p className="text-foreground line-clamp-2 text-sm">
                    {prompt.text}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile: stacked layout */}
        <div className="flex flex-col gap-3 lg:hidden">
          {/* Horizontal icon strip */}
          <div className="mb-4 flex items-center justify-center gap-3 overflow-x-auto">
            {APP_ICONS.slice(0, 8).map((slug) => (
              <div key={slug} className="shrink-0 opacity-30">
                <Image
                  src={`/images/logos/${slug}.svg`}
                  alt=""
                  aria-hidden
                  width={24}
                  height={24}
                  style={{ width: 24, height: 24 }}
                />
              </div>
            ))}
          </div>

          {/* Stacked prompt cards */}
          {PROMPTS.map((prompt, i) => (
            <AnimateOnView
              key={i}
              className="bg-card border-border rounded-xl border px-4 py-3 shadow-sm"
              delay={i * 0.08}
              duration={0.4}
            >
              <div className="flex items-start gap-3">
                <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                  {prompt.icons.map((slug) => (
                    <Image
                      key={slug}
                      src={`/images/logos/${slug}.svg`}
                      alt=""
                      aria-hidden
                      width={18}
                      height={18}
                      style={{ width: 18, height: 18 }}
                    />
                  ))}
                </div>
                <p className="text-foreground text-sm">{prompt.text}</p>
              </div>
            </AnimateOnView>
          ))}
        </div>
      </div>
    </section>
  )
}
