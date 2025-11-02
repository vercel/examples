import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  children: ReactNode
}

export function Panel({ className, children }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col relative border border-primary/18 w-full h-full shadow-sm rounded-sm',
        className
      )}
    >
      {children}
    </div>
  )
}

export function PanelHeader({ className, children }: Props) {
  return (
    <div
      className={cn(
        'text-sm flex items-center border-b border-primary/18 px-2.5 py-1.5 text-secondary-foreground bg-secondary',
        className
      )}
    >
      {children}
    </div>
  )
}
