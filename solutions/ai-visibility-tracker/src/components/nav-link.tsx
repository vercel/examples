'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { cn } from 'cn'

export function NavLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  const pathname = usePathname()
  const active =
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(`${href}/`)
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors [&_svg]:size-4 [&_svg]:shrink-0',
        active
          ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
          : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground'
      )}
    >
      {children}
    </Link>
  )
}
