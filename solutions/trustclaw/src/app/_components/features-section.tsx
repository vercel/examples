import Image from 'next/image'
import type { ReactNode } from 'react'
import {
  Cloud,
  Clock,
  Shield,
  Zap,
  MessageCircle,
  Layers,
  type LucideIcon,
} from 'lucide-react'
import { AnimateOnView } from '~/components/core/animate-on-view'

interface Feature {
  icon: LucideIcon
  title: string
  description: ReactNode
}

const SMALL_FEATURES: Feature[] = [
  {
    icon: Shield,
    title: 'OAuth Only',
    description: (
      <>
        Connects through <strong>OAuth</strong>. No passwords stored or shared.
      </>
    ),
  },
  {
    icon: Zap,
    title: 'Zero Setup',
    description: (
      <>
        <strong>Sign up</strong>, chat, done. No API keys or config files.
      </>
    ),
  },
  {
    icon: Clock,
    title: 'Works While You Sleep',
    description: (
      <>
        <strong>Schedule</strong> tasks and let your agent handle them on
        autopilot.
      </>
    ),
  },
  {
    icon: Cloud,
    title: 'Sandboxed Execution',
    description: (
      <>
        Every action runs in an <strong>isolated cloud environment</strong>{' '}
        that&apos;s gone when the task is done.
      </>
    ),
  },
]

const MESSAGING_PLATFORMS: {
  name: string
  slug: string
  disabled: boolean
}[] = [
  { name: 'Telegram', slug: 'telegram', disabled: false },
  { name: 'WhatsApp', slug: 'whatsapp', disabled: true },
  { name: 'Discord', slug: 'discord', disabled: true },
  { name: 'Slack', slug: 'slack', disabled: true },
]

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <AnimateOnView delay={index * 0.1}>
      <div className="from-border via-border/50 h-full rounded-xl bg-linear-to-br to-transparent p-px">
        <div className="bg-card flex h-full flex-col gap-4 rounded-xl p-6">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full shadow-[0_0_15px_oklch(0.488_0.243_264.376/0.2)]">
            <feature.icon className="text-foreground h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-foreground font-semibold">{feature.title}</h3>
            {feature.description && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </AnimateOnView>
  )
}

const INTEGRATION_TOOLS: { slug: string; name: string }[] = [
  { slug: 'gmail', name: 'Gmail' },
  { slug: 'github', name: 'GitHub' },
  { slug: 'notion', name: 'Notion' },
  { slug: 'figma', name: 'Figma' },
  { slug: 'linear', name: 'Linear' },
  { slug: 'jira', name: 'Jira' },
  { slug: 'discord', name: 'Discord' },
  { slug: 'googledrive', name: 'Google Drive' },
  { slug: 'googlecalendar', name: 'Google Calendar' },
  { slug: 'todoist', name: 'Todoist' },
  { slug: 'asana', name: 'Asana' },
  { slug: 'trello', name: 'Trello' },
  { slug: 'stripe', name: 'Stripe' },
  { slug: 'hubspot', name: 'HubSpot' },
  { slug: 'airtable', name: 'Airtable' },
]

function IntegrationsFeatureCard({ index }: { index: number }) {
  return (
    <AnimateOnView delay={index * 0.1}>
      <div className="from-border via-border/50 h-full rounded-xl bg-linear-to-br to-transparent p-px">
        <div className="bg-card flex h-full flex-col gap-4 rounded-xl p-6">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full shadow-[0_0_15px_oklch(0.488_0.243_264.376/0.2)]">
            <Layers className="text-foreground h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-foreground font-semibold">
              1000+ Integrations
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connect to all of your favourite apps in a single click.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-2 pt-1">
            {INTEGRATION_TOOLS.map((tool) => (
              <div
                key={tool.slug}
                className="border-border bg-background flex items-center justify-center rounded-lg border p-1.5"
                title={tool.name}
              >
                <Image
                  src={`/images/logos/${tool.slug}.svg`}
                  alt={tool.name}
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-center text-xs">
            + 985 more
          </p>
        </div>
      </div>
    </AnimateOnView>
  )
}

function MessagingFeatureCard({ index }: { index: number }) {
  return (
    <AnimateOnView delay={index * 0.1}>
      <div className="from-border via-border/50 h-full rounded-xl bg-linear-to-br to-transparent p-px">
        <div className="bg-card flex h-full flex-col gap-4 rounded-xl p-6">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full shadow-[0_0_15px_oklch(0.488_0.243_264.376/0.2)]">
            <MessageCircle className="text-foreground h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-foreground font-semibold">
              Every Messaging App
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Chat with your AI on Telegram, WhatsApp, Discord, or Slack. Same
              agent, same tools, wherever you are.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {MESSAGING_PLATFORMS.map((platform) => (
              <div
                key={platform.name}
                className={`border-border bg-background flex items-center gap-2 rounded-lg border px-3 py-2${
                  platform.disabled ? ' opacity-40' : ''
                }`}
              >
                <Image
                  src={`/images/logos/${platform.slug}.svg`}
                  alt=""
                  aria-hidden
                  width={20}
                  height={20}
                />
                <span className="text-muted-foreground text-sm font-medium">
                  {platform.name}
                  {platform.disabled && (
                    <span className="text-muted-foreground/60 ml-1 text-xs">
                      Soon
                    </span>
                  )}
                </span>
              </div>
            ))}
            <div className="border-border bg-background flex items-center justify-center rounded-lg border border-dashed px-3 py-2">
              <span className="text-muted-foreground text-xs font-medium">
                More coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </AnimateOnView>
  )
}

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <Image
        src="/images/elements/quarter_circle.svg"
        alt=""
        aria-hidden
        width={800}
        height={800}
        priority={false}
        className="pointer-events-none absolute top-0 -right-40 hidden h-[500px] w-[500px] opacity-[0.07] md:h-[700px] md:w-[700px] dark:block"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-16">
          <h2 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
            Stop giving OpenClaw your passwords.
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base md:text-lg">
            Everything OpenClaw can do and more, rebuilt from scratch with
            security at the foundation.
          </p>
        </div>

        {/* Top row -- 2 big cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <MessagingFeatureCard index={0} />
          <IntegrationsFeatureCard index={1} />
        </div>

        {/* Bottom row -- 4 small cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-6 md:gap-6 lg:grid-cols-4">
          {SMALL_FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index + 2}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
