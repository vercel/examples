'use client'

import type { ReactNode } from 'react'
import { useTabState } from './use-tab-state'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  children: ReactNode
  tabId: string
}

export function TabContent({ children, tabId, className }: Props) {
  const [activeTabId] = useTabState()
  return (
    <div
      className={cn(
        'hidden min-h-0 h-full lg:flex ',
        { flex: activeTabId === tabId },
        className
      )}
    >
      {children}
    </div>
  )
}
