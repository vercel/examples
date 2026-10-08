import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from 'cn'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export { cn }

/** Cell padding that aligns table content with card headers when the content is flush. */
export const TABLE_INSET =
  '[&_th:first-child]:pl-6 [&_td:first-child]:pl-6 [&_th:last-child]:pr-6 [&_td:last-child]:pr-6'

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}

export function Stat({
  label,
  value,
  delta,
  hint,
}: {
  label: string
  value: string
  delta?: string | null
  hint?: string
}) {
  return (
    <Card size="sm">
      <CardContent>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="num mt-1 text-3xl font-semibold tracking-tight">
          {value}
        </p>
        {delta || hint ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {delta ? <span className="text-foreground">{delta}</span> : null}
            {delta && hint ? ' · ' : null}
            {hint}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

/** A card with a titled header. `flush` removes the content padding for tables and lists. */
export function Section({
  title,
  description,
  action,
  children,
  flush = false,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  flush?: boolean
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className={cn(flush && 'px-0')}>{children}</CardContent>
    </Card>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <p className="text-base font-medium">{title}</p>
      {description ? (
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function Notice({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Alert className={className}>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function TextLink({
  href,
  children,
  className,
  muted = false,
}: {
  href: string
  children: ReactNode
  className?: string
  muted?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'underline-offset-4 hover:underline',
        muted
          ? 'text-muted-foreground hover:text-foreground'
          : 'text-foreground',
        className
      )}
    >
      {children}
    </Link>
  )
}

export function Muted({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
  )
}

/** Period switch rendered as links so it works without JavaScript. */
export function PeriodSelect({
  current,
  basePath,
  params,
}: {
  current: string
  basePath: string
  params?: Record<string, string | undefined>
}) {
  const periods = [
    { key: '7d', label: '7d' },
    { key: '30d', label: '30d' },
    { key: '90d', label: '90d' },
  ]
  return (
    <div
      className="inline-flex h-9 items-center rounded-md border bg-background p-0.5"
      role="group"
      aria-label="Period"
    >
      {periods.map((p) => {
        const search = new URLSearchParams()
        for (const [key, value] of Object.entries(params ?? {}))
          if (value) search.set(key, value)
        search.set('period', p.key)
        const active = p.key === current
        return (
          <Link
            key={p.key}
            href={`${basePath}?${search.toString()}`}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'num inline-flex h-full items-center rounded-sm px-3 text-xs font-medium transition-colors',
              active
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {p.label}
          </Link>
        )
      })}
    </div>
  )
}
