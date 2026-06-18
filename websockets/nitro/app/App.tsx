import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { HeroBackdrop } from '@/components/hero-backdrop'
import { LiveCanvas } from '@/components/live-canvas'
import { PresenceBar } from '@/components/presence-bar'
import {
  GitHubLogo,
  MousePointer2,
  Sparkles,
  Users,
  VercelLogo,
} from '@/components/icons'
import { useRealtime } from '@/hooks/use-realtime'
import { cn } from '@/lib/utils'
import { site } from '@/lib/site'

const features = [
  {
    icon: MousePointer2,
    title: 'Live cursors',
    description:
      'Every pointer move is broadcast over a single WebSocket and rendered for everyone in the room.',
  },
  {
    icon: Users,
    title: 'Presence',
    description:
      'Join and leave events keep an accurate, shared roster of who is currently connected.',
  },
  {
    icon: Sparkles,
    title: 'Reactions',
    description:
      'Ephemeral emoji bursts fan out to everyone in the room over the same WebSocket connection.',
  },
]

export function App() {
  const rt = useRealtime()

  return (
    <div className="relative min-h-screen">
      <HeroBackdrop />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <img src="/nitro.svg" alt="Nitro" className="size-6" />
          <span className="text-muted-foreground">×</span>
          <VercelLogo className="size-6" />
          <span className="hidden text-sm sm:inline">WebSockets</span>
        </div>

        <a
          href={site.deployUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({ variant: 'secondary', size: 'sm' }),
            'bg-white text-black hover:bg-white/90',
          )}
        >
          <VercelLogo className="size-5" />
          Deploy with Vercel
        </a>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-20">
        <section className="flex flex-col items-center gap-5 py-10 text-center sm:py-14">
          <Badge variant="subtle" className="rounded-full px-3 py-1">
            Vercel Functions · WebSockets Beta
          </Badge>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Realtime, served from a Vercel Function
          </h1>
          <p className="max-w-xl text-balance text-muted-foreground">
            A minimal Nitro v3 + React starter for the Vercel WebSockets beta.
            Move your cursor below — everything you see is live presence,
            cursors, and reactions over one connection.
          </p>
          <PresenceBar rt={rt} />
        </section>

        <LiveCanvas rt={rt} />

        <section className="mt-16 grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-2 rounded-lg border bg-card p-5"
            >
              <feature.icon className="size-5 text-primary" />
              <h3 className="font-medium text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="relative z-10 border-t">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            Built with{' '}
            <a
              href="https://nitro.build"
              target="_blank"
              rel="noreferrer"
              className="text-foreground hover:underline"
            >
              Nitro
            </a>{' '}
            and{' '}
            <a
              href="https://vercel.com/docs/functions/websockets"
              target="_blank"
              rel="noreferrer"
              className="text-foreground hover:underline"
            >
              Vercel WebSockets
            </a>
            .
          </p>

          <a
            href={site.repo}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <GitHubLogo className="size-4" />
            vercel/examples
          </a>
        </div>
      </footer>
    </div>
  )
}
