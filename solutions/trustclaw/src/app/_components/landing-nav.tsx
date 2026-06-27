'use client'

import { Button } from '~/components/ui/button'
import Link from 'next/link'
import { ThemeToggle } from '~/components/core/theme-toggle'
import { TrustClawBrand } from './trustclaw-brand'

export function LandingNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <TrustClawBrand size="md" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
