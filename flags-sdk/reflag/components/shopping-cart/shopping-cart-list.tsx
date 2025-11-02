'use client'

import { AnimatePresence } from 'motion/react'

export function ShoppingCartList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="-my-6 divide-y divide-gray-200">
      <AnimatePresence mode="popLayout" initial={false}>
        {children}
      </AnimatePresence>
    </ul>
  )
}
