'use client'

import Link from 'next/link'
import { ComposioWordmark } from '~/app/_components/composio-wordmark'

export function ComposioCta() {
  return (
    <div className="flex items-center justify-center gap-1.5 bg-chart-1/10 py-2 text-xs text-chart-1">
      <span>You can build this and more with</span>
      <Link
        href="https://composio.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-px font-medium transition-colors hover:text-chart-1/80"
      >
        <span
          className="inline-block h-3 w-3 bg-current opacity-70 transition-opacity group-hover:opacity-100"
          style={{
            maskImage: 'url(/images/logo/ComposioTransparent.png)',
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
          }}
        />
        <ComposioWordmark
          height={10}
          className="translate-y-px text-chart-1 transition-colors group-hover:text-chart-1/80"
        />
      </Link>
    </div>
  )
}
