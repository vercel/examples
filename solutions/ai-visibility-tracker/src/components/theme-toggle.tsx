'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { cn } from 'cn'

const OPTIONS = [
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
] as const

const subscribeNoop = () => () => {}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // The stored theme is only known in the browser; render "system" during SSR.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )
  const current = mounted ? theme ?? 'system' : 'system'

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center rounded-full border p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={current === value}
          aria-label={label}
          title={label}
          onClick={() => setTheme(value)}
          className={cn(
            'flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground',
            current === value && 'bg-muted text-foreground'
          )}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  )
}
