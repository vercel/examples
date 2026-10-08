import {
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Play,
  Settings,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { logout } from '@/app/actions/auth'
import { startRun } from '@/app/actions/runs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Brand, Run } from '@/lib/db/schema'
import { NavLink } from './nav-link'
import { ThemeToggle } from './theme-toggle'

const NAV = [
  { href: '/', label: 'Overview', Icon: LayoutDashboard },
  { href: '/questions', label: 'Questions', Icon: MessageSquareText },
  { href: '/answers', label: 'Answers', Icon: FileText },
  { href: '/competitors', label: 'Competitors', Icon: Users },
  { href: '/settings', label: 'Settings', Icon: Settings },
]

const REPO_URL = 'https://github.com/eduardmur/ai-visibility-tracker'

function RunControl({
  running,
  full,
  readOnly,
}: {
  running: Run | null
  full?: boolean
  readOnly?: boolean
}) {
  if (readOnly) {
    return (
      <Button asChild variant="outline" className={full ? 'w-full' : undefined}>
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          Deploy your own
          <ExternalLink data-icon="inline-end" />
        </a>
      </Button>
    )
  }
  if (running) {
    return (
      <Button asChild variant="outline" className={full ? 'w-full' : undefined}>
        <Link href={`/runs/${running.id}`}>
          <span
            className="size-1.5 animate-pulse rounded-full bg-foreground"
            aria-hidden
          />
          Checking…
        </Link>
      </Button>
    )
  }
  return (
    <form action={startRun}>
      <Button type="submit" className={full ? 'w-full' : undefined}>
        <Play data-icon="inline-start" />
        Run now
      </Button>
    </form>
  )
}

export function Shell({
  brand,
  running,
  readOnly = false,
  children,
}: {
  brand: Brand
  running: Run | null
  /** Demo deployment viewed without the admin session: no mutations, no logout. */
  readOnly?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-sidebar lg:flex">
        <div className="px-5 pt-5 pb-4">
          <Link href="/" className="block truncate text-sm font-semibold">
            {brand.name}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            {brand.domain}
          </p>
          {readOnly ? (
            <Badge variant="secondary" className="mt-2">
              Demo · sample data
            </Badge>
          ) : null}
        </div>
        <div className="px-3">
          <RunControl running={running} full readOnly={readOnly} />
        </div>
        <nav className="mt-4 flex flex-col gap-0.5 px-3" aria-label="Main">
          {NAV.map(({ href, label, Icon }) => (
            <NavLink key={href} href={href}>
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-5 pb-5">
          <Separator className="mb-4" />
          <div className="flex items-center justify-between gap-2">
            <ThemeToggle />
            {readOnly ? null : (
              <form action={logout}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut />
                </Button>
              </form>
            )}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Open source by{' '}
            <a
              href="https://searcherries.com?utm_source=ai-visibility-tracker&utm_medium=app"
              className="text-foreground underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Searcherries
            </a>
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <Link href="/" className="block truncate text-sm font-semibold">
                {brand.name}
              </Link>
              <p className="truncate text-xs text-muted-foreground">
                {brand.domain}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <RunControl running={running} readOnly={readOnly} />
            </div>
          </div>
          <nav
            className="flex gap-1 overflow-x-auto px-3 pb-2"
            aria-label="Main"
          >
            {NAV.map(({ href, label, Icon }) => (
              <NavLink key={href} href={href}>
                <Icon />
                {label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
