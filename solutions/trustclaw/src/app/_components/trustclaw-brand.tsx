'use client'

import Image from 'next/image'
import Link from 'next/link'
import { OpenClawLogo } from './openclaw-logo'
import { ComposioWordmark } from './composio-wordmark'

interface TrustClawBrandProps {
  size?: 'sm' | 'md' | 'lg'
  logoLink?: string
}

const SIZES = {
  sm: {
    logo: 20,
    text: 'text-xs',
    wordmark: 9,
    by: 'text-[8px]',
    gap: 'gap-1.5',
    composioLogo: 10,
  },
  md: {
    logo: 24,
    text: 'text-lg',
    wordmark: 11,
    by: 'text-[9px]',
    gap: 'gap-2',
    composioLogo: 12,
  },
  lg: {
    logo: 48,
    text: 'text-2xl',
    wordmark: 12,
    by: 'text-[10px]',
    gap: 'gap-3',
    composioLogo: 14,
  },
} as const

export function TrustClawBrand({ size = 'md', logoLink }: TrustClawBrandProps) {
  const s = SIZES[size]

  const logo = <OpenClawLogo size={s.logo} />

  return (
    <div className={`flex items-center ${s.gap}`}>
      {logoLink ? <Link href={logoLink}>{logo}</Link> : logo}
      <div className="relative">
        <span className={`${s.text} font-bold leading-tight text-foreground`}>
          TrustClaw
        </span>
        <Link
          href="https://composio.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="group absolute bottom-0 right-0 flex translate-y-[80%] items-center gap-0.5"
        >
          <span className={`${s.by} text-muted-foreground`}>by</span>
          <Image
            src="/images/logo/ComposioTransparent.png"
            alt=""
            width={s.composioLogo}
            height={s.composioLogo}
            className="-mr-0.5 opacity-50 transition-opacity group-hover:opacity-100 dark:invert"
          />
          <ComposioWordmark
            height={s.wordmark}
            className="translate-y-px text-muted-foreground transition-colors group-hover:text-foreground"
          />
        </Link>
      </div>
    </div>
  )
}
