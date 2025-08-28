'use client'

import type { ReactNode } from 'react'
import { useTabState } from './use-tab-state'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  tabId: string
}

export function TabItem({ children, tabId }: Props) {
  const [activeTabId, setTabId] = useTabState()
  return (
    <li
      className={cn({ 'border-b border-b-black': activeTabId === tabId })}
      onClick={() => setTabId(tabId)}
    >
      {children}
    </li>
  )
}
